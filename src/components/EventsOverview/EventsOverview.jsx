import React, { useState } from "react";
import "./styles.css";
import canary1 from "/images/canary1.jpg"
import canary2 from "/images/canary2.jpg";
import canary3 from "/images/canary3.jpg";
import canary4 from "/images/canary4.jpg";
import canary5 from "/images/canary5.jpg";
import canary6 from "/images/canary6.jpg";
import canary7 from "/images/canary7.jpg";
import canary8 from "/images/canary8.jpg";
import canary9 from "/images/canary9.jpg";
import canary10 from "/images/canary10.jpg";
import canary11 from "/images/canary11.jpg";
import canary12 from "/images/canary12.jpg";
import canary13 from "/images/canary13.jpg";
import canary14 from "/images/canary14.jpg";
import canary15 from "/images/canary15.jpg";
import canary16 from "/images/canary16.jpg";
import canary17 from "/images/canary17.jpg";
import canary18 from "/images/canary18.jpg";
import canary19 from "/images/canary19.jpg";
const events = [
  {
    imageUrl:
      canary1,
    title: "Tên sự kiện 1",
  },
  {
    imageUrl:
      canary2,
    title: "Tên sự kiện 2",
  },
  {
    imageUrl:
      canary4,
    title: "Tên sự kiện 3",
  },
  {
    imageUrl:
     canary9,
    title: "Tên sự kiện 4",
  },
  {
    imageUrl:
     canary16,
    title: "Tên sự kiện 5",
  },
];

function EventsOverview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length,
    );
  };

  // Calculate the range of events to display
  const displayedEvents = events
    .slice(currentIndex, currentIndex + 4)
    .concat(events.slice(0, Math.max(0, currentIndex + 4 - events.length)));

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Tổng kết các sự kiện đã qua</h2>
      <div className="slider">
        <button onClick={prevImage} className="prev-button">
          Previous
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ml-auto mr-auto mb-10 w-2/3 gap-5 h-64 overflow-hidden">
          {displayedEvents.map((event, index) => (
            <div
              className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden shadow-md flex p-2 text-white items-end"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${event.imageUrl})`,
              }}
              key={index}
            >
              <h3 className="font-medium">{event.title}</h3>
            </div>
          ))}
        </div>
        <button onClick={nextImage} className="next-button">
          Next
        </button>
      </div>
    </section>
  );
}

export default EventsOverview;