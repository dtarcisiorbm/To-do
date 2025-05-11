
import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Task } from '@/types/task';

const localizer = momentLocalizer(moment);

interface TaskCalendarViewProps {
  tasks: Task[];
  onSelectEvent: (task: Task) => void;
}

const TaskCalendarView = ({ tasks, onSelectEvent }: TaskCalendarViewProps) => {
  const events = tasks
    .filter(task => task.dueDate)
    .map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      end: task.dueDate,
      allDay: true,
      resource: task,
      className: `priority-${task.priority} ${task.completed ? 'completed' : ''}`,
    }));

  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    let backgroundColor = '#60A5FA'; // default/low

    if (task.priority === 'medium') {
      backgroundColor = '#F59E0B';
    } else if (task.priority === 'high') {
      backgroundColor = '#EF4444';
    }

    const style = {
      backgroundColor,
      opacity: task.completed ? 0.6 : 1,
      borderRadius: '4px',
      color: '#fff',
      border: 'none',
      display: 'block',
    };
    return { style };
  };

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow-sm">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectEvent(event.resource as Task)}
      />
    </div>
  );
};

export default TaskCalendarView;
