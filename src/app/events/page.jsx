import React from "react";
import DonateOverview from "../../components/DonateOverview/DonateOverview";
import ProjectOverview from "../../components/projectOverview/ProjectOverview";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import EventsOverview from "../../components/EventsOverview/EventsOverview";
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
function Events() {
  return (
    <>
      <div style={{ backgroundImage: `linear-gradient(
      to bottom,
      transparent 70%,
      rgba(0, 0, 0, 0.6)
    ), url(${canary5})` }} className="hero_section">
        
        <h1>Tên sự kiện</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum
          cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum
          facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget
          aliquet gravida ac nisl vitae quis.
        </p>
      </div>

      <div className="projects">
        <ProjectOverview />
        <DonateOverview />
        <ProjectLayout />
        <EventsOverview />
      </div>
    </>
  );
}

export default Events;