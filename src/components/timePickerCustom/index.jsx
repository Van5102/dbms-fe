import { useState } from 'react'
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from 'utils/constants/config'
import moment from 'moment'
import dayjs from 'dayjs'
import "./index.scss"

import {
  Row, Col, DatePicker,
} from 'antd'

const TimePickerCustom = ({setDatetime, disabled}) => {
  const [time, setTime] = useState()
  const [date, setDate] = useState()

  const handleSetDatetime = (time) => {
    setTime(time)
    
    if (!time) {
      setDatetime(null)
      return
    }

    const time_str = dayjs(time).format(TIME_FORMAT)
   
    const t = moment(`${time_str} `, DATETIME_FORMAT).format("x")
    setDatetime(t)
  }

  return (
    <Row gutter={[4, 0]}>
      <Col span={12}>
        <DatePicker
          className="w-full"
          popupClassName='date-picker-custom'
          allowClear={false}
          format={TIME_FORMAT}

          onSelect={(v) =>{
             handleSetDatetime(v)
                console.log('time:',v)
            }}
          disabledTime={disabled || null}
          picker='time'
          value={time}
          key={ Math.floor(Math.random())}
        />
      </Col>

      
    </Row>
  )
}

export default TimePickerCustom