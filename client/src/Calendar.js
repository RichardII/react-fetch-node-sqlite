import React, { useState, useEffect } from "react";
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'


function Calendar(props) {

    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [currentEvents, setCurrentEvents] = useState(props.noteList.map(row => ({
        id: row.id,
        title: row.text,
        start: row.insert_date
    })));

    const calendarComponentRef = React.createRef();

    function renderEventContent(eventInfo) {
        return (
          <>
            <b>{eventInfo.timeText}</b> 
            <i> {eventInfo.event.title}</i>
          </>
        )
    }
    
    const handleDateSelect = (selectInfo) => {
        
        let calendarApi = calendarComponentRef.current.getApi();
        calendarApi.changeView("timeGridDay")
        calendarApi.gotoDate(selectInfo.dateStr); // call a method on the Calendar object



        // let title = prompt('Please enter a new title for your event')
        // let calendarApi = selectInfo.view.calendar
    
        // // calendarApi.unselect() // clear date selection
    
        // if (title) {
        //   calendarApi.addEvent({
        //     id: createEventId(),
        //     title,
        //     start: selectInfo.startStr,
        //     end: selectInfo.endStr,
        //     allDay: selectInfo.allDay
        //   })
        // }
    }
    
    const handleEventClick = (clickInfo) => {
        
    }

    const handleEvents = (events) => {
        setCurrentEvents(events);
    }
    
    return (
        <>
            <div style={{ mmaxHeight: "50%", maxWidth: "100%"}}>
            <FullCalendar 
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,today,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridDay'
                }}
                initialView='dayGridMonth'
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                ref={calendarComponentRef} 
                weekends={weekendsVisible}
                initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
                // select={handleDateSelect}
                dateClick={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                />
            </div>
        </>
    )
}

export default Calendar;