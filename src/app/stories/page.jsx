import React from "react";
import "./styles.css";
import canary7 from "/images/canary7.jpg";
import canary9 from "/images/canary9.jpg";
function Story() {
  return (
    <>
      <div style={{ backgroundImage: `linear-gradient(
            to bottom,
            transparent 70%,
            rgba(0, 0, 0, 0.6)
          ), url(${canary7})` }} className="hero_section">
        <h1>Tên câu chuyện</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum
          cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum
          facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget
          aliquet gravida ac nisl vitae quis.
        </p>
        <button
          style={{ backgroundColor: "#4160DF" }}
          className="text-white font-medium px-3 py-2 rounded-full mt-2 w-30"
        >
          Đọc thêm
        </button>
      </div>

      <div className="items-center">
        <h2 className="mt-5 text-xl ml-5 sm:ml-0">Câu chuyện ý nghĩa</h2>

        {/* Mobile Display */}
        <div className="block sm:hidden mt-4 mb-5">
          <div className="flex flex-col items-center">
            <div className="w-auto h-auto overflow-hidden rounded-lg mb-4">
              <img
                src={canary9}
                alt="Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-content text-center">
              <h3 className="text-lg font-semibold">Tên câu chuyện</h3>
              <p className="text-sm px-3">
                Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque
                interdum cursus leo nibh sit. Diam tellus ornare tortor cursus
                vestibulum facilisis ac. Turpis sed magnis placerat semper
                mauris in diam. Eget aliquet gravida ac nisl vitae quis.
              </p>
              <button
                style={{ backgroundColor: "#4160DF" }}
                className="text-white font-medium px-3 py-2 rounded-full mt-2"
              >
                Đọc thêm
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Display */}
        <div className="hidden sm:block">
          <div className="flex flex-row justify-center items-start mt-10">
            <div className="image-container w-36 h-36 overflow-hidden rounded-lg mr-4">
              <img
                src={
                  "https://s3-alpha-sig.figma.com/img/a07a/b75a/2ce8bfdba6a86b343a6621bb686a5412?Expires=1739145600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cGIrWAD3KuhNPvt-GnL6g92XgRqAJKyk3KcRRF7CJ7QT6YWUWAt~EdsgLuhVxsw12Fu8AOsO6twwzb4-Vwn5n~7oObRp~bJQWyx3W--fWRtcBCcQfzekwMcyS7WXH3vx8vK6kSG4ILlTfp9xtq8w82OSarREJibwk7~HTf1YiUF9KaBy~BHaEmsFLDsPlSEYKt4DuGDYcfDSsnA3wmCzGhPMKNFs25WKJ-rASQj3yS51VgSiHGqBqr80d4k1KM9vFU961eDFD~PwDPzaDE9TDsWH5BJ4aMcbXtSDQGGmZHQrW2JcGQ6Wdr2jSnM7LAlC5AbYDqEjeUd~eIwtAfbIcw__"
                }
                alt="Câu chuyện"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-content max-w-md">
              <h3 className="text-lg font-semibold">Tên câu chuyện</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque
                interdum cursus leo nibh sit. Diam tellus ornare tortor cursus
                vestibulum facilisis ac. Turpis sed magnis placerat semper
                mauris in diam. Eget aliquet gravida ac nisl vitae quis.
              </p>
              <button
                style={{ backgroundColor: "#4160DF" }}
                className="text-white font-medium px-3 py-2 rounded-full mt-2"
              >
                Đọc thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Story;
