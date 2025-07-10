import React from "react";
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

function ProjectOverview() {
  return (
    <section className="project-overview">
      <h2>Tổng quan dự án</h2>

      <div className="project-container">
        <div className="image-grid-container">
          <div className="image-grid">
            <img
              src={canary2}
              alt="Image 1"
            />
            <img
              src={canary2}
              alt="Image 2"
            />
            <img
              className="center-image"
              src={canary2}
              alt="Center Image"
            />
            <img
              src={canary2}
              alt="Image 3"
            />
            <img
              src={canary2}
              alt="Image 4"
            />
          </div>
        </div>

        <div className="text-content">
          <h3>Tên dự án</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum
            cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum
            facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget
            aliquet gravida ac nisl vitae quis.
          </p>
          <button
            style={{ backgroundColor: "#4160DF" }}
            className="text-white font-medium px-3 py-2 rounded-full"
          >
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverview;