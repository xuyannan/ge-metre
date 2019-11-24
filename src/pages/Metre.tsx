import React from 'react';
import { Row, Col, Button, Card, Input, Form, Popconfirm, Timeline, Icon } from 'antd';
import styles from './Metre.less';
import EventQueue from '../entities/EventQueue';
import GEvent, { EventType } from '../entities/GEvent';
import moment from 'moment';
import { GE_METRE_TIME_REMAIN, METRE_DURATION } from '../entities/EventQueue';

@Form.create({})
export default class Metre extends React.PureComponent {
    constructor(props: any) {
        super(props);
        const timeRemainInStorage = localStorage.getItem(GE_METRE_TIME_REMAIN);
        let timeRemain = timeRemainInStorage ? parseInt(timeRemainInStorage) : METRE_DURATION;
        // const currentEvent = this.queue.getCurrentEvent(moment('2019-11-24 18:00:00')); 
        const queue = new EventQueue();
        const currentEvent = queue.getCurrentEvent();
        this.state = {
            timeRemain,
            now: moment(),
            queue,
            currentEvent,
            interval: setInterval(() => {
                this.timer();
            }, 1000)
        }

    }

    timer = () => {
        // const currentEvent = this.queue.getCurrentEvent(moment('2019-11-24 18:00:00'));
        const currentEvent = this.state.queue.getCurrentEvent();
        this.setState({
            currentEvent
        })
        if (currentEvent && currentEvent.type == EventType.Work) {
            const timeRemainInStorage = localStorage.getItem(GE_METRE_TIME_REMAIN)
            let timeRemain = timeRemainInStorage ? parseInt(timeRemainInStorage) : METRE_DURATION;

            if (timeRemain === 0) {
                timeRemain = METRE_DURATION
            }
            this.setState({
                timeRemain
            })
            localStorage.setItem(GE_METRE_TIME_REMAIN, timeRemain - 1 + "");
        }
    }

    componentDidMount() {
        // 更新当前时间
        setInterval(() => {
            this.setState({
                now: moment(),
                currentEvent: this.state.queue.getCurrentEvent()
            })
        }, 1000);

        //  启动计时
        const { interval } = this.state;
        if (interval) {
            clearInterval(this.state.interval);
        }
        this.start();
    }

    pause = () => {
        clearInterval(this.state.interval);
        this.setState({
            interval: null
        })
    }

    adjust = () => {
        const { form } = this.props;
        const { validateFields, resetFields } = form;
        validateFields((err: any, fieldsValue: any) => {
            if (!err) {
                const {timeRemain} = fieldsValue;
                localStorage.setItem(GE_METRE_TIME_REMAIN, parseInt(timeRemain) * 60 + '');
                resetFields();
            }
        })
    }

    start = () => {
        this.setState({
            interval: setInterval(() => {
                this.timer();
            }, 1000)
        })
    }

    hasErrors = (fieldsError: any) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    render() {
        const { timeRemain, now, currentEvent, interval, queue } = this.state;
        const { form } = this.props;
        const seconds = timeRemain % 60;
        const minutes = (timeRemain - seconds) / 60;
        const { getFieldDecorator, getFieldsError } = form;

        return (
            <Row>
                <Col span={18} >
                    <Card style={{height: "100%", padding: 200, border: "none", textAlign: "center"}}>
                        <div>
                            <span className={styles.time}>{minutes}</span>
                            <span className={styles.unit}>分</span>
                            <span className={styles.time}>{seconds < 10 ? '0' + seconds : seconds}</span>
                            <span className={styles.unit}>秒</span>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{border: "none"}}>
                        <Row>
                            <Col span={24}>
                                <p>{now.format('YYYY-MM-DD HH:mm:ss')}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Timeline>
                                {queue ? queue.getEventList().map((e: GEvent, index: number) => (
                                    <Timeline.Item
                                        key={`e.name${index}`}
                                        dot={<Icon type={e.type === EventType.Work ? "tool" : "smile"}/>}
                                        color={currentEvent && currentEvent.startAt.diff(e.startAt) === 0 ? "green" : "blue"}
                                    ><p>{e.startAt.format("HH:mm:ss")}<br/>{e.name}</p></Timeline.Item>
                                )): null}
                                </Timeline>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {
                                    interval
                                        ? <Button icon="pause-circle" disabled={!currentEvent || currentEvent.type === EventType.Break} onClick={this.pause}>PAUSE</Button>
                                        : <Button icon="play-circle" disabled={!currentEvent || currentEvent.type === EventType.Break} onClick={this.start}>START</Button>
                                }
                            </Col>
                            <Col span={24}>
                                <Form layout="inline">
                                    <Form.Item>
                                        {getFieldDecorator('timeRemain', {
                                            rules: [{ required: true, message: '这里需要输入数字 ' }],
                                            initialValue: (METRE_DURATION) / 60
                                        })(
                                            <Input
                                                suffix="分钟"
                                                placeholder="调整剩余时间"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <Popconfirm placement="top" title={"确定要调整时间吗？"} onConfirm={this.adjust} okText="确认" cancelText="取消">
                                            <Button type="primary" disabled={this.hasErrors(getFieldsError())}>
                                                调整
                                            </Button>
                                        </Popconfirm>
                                    </Form.Item>
                                </Form>

                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}
