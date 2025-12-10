import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
} from 'date-fns'
import ko from 'date-fns/locale/ko'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function DatePicker({ selected, onChange, disabledDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={prevMonth}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <h3 className="font-semibold">
        {format(currentMonth, 'yyyy년 M월', { locale: ko })}
      </h3>
      <button
        type="button"
        onClick={nextMonth}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  )

  const renderDays = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const isDisabled =
          !isSameMonth(day, monthStart) ||
          isBefore(day, new Date()) ||
          disabledDates.some((d) => isSameDay(d, day))

        days.push(
          <button
            key={day.toString()}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(cloneDay)}
            className={`
              aspect-square flex items-center justify-center text-sm rounded-lg
              ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary-100'}
              ${isSameDay(day, selected) ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
              ${isToday(day) && !isSameDay(day, selected) ? 'border border-primary-600' : ''}
              ${i === 0 && !isDisabled ? 'text-red-500' : ''}
              ${i === 6 && !isDisabled ? 'text-blue-500' : ''}
            `}
          >
            {format(day, 'd')}
          </button>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      )
      days = []
    }

    return <div className="space-y-1">{rows}</div>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}

export default DatePicker
