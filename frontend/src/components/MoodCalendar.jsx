import React, { useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { moodColors } from '../constants/moodColors';
import { usePostsContext } from '../hooks/usePostsContext';

const MoodCalendar = () => {
    const { posts } = usePostsContext();

    const tileContent = ({ date }) => {
        const entry = posts?.find(
            (post) => new Date(post.date).toDateString() === date.toDateString()
        );
        if (entry) {
            return (
                <div
                    style={{
                        backgroundColor: moodColors[entry.mood],
                        width: '100%',
                        height: '100%',
                        borderRadius: '4px'
                    }}
                ></div>
            );
        }
        return null;
    };

    return (
        <div className="calendar-container">
            <Calendar
                className = "react-calendar"
                tileContent={tileContent}
            />
        </div>
    );
};

export default MoodCalendar;