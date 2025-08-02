import PropTypes from 'prop-types';
import { useState } from 'react';
import { TextInput } from '../../Inputs/TextInput';
import { ImageInput } from '../../Inputs/ImageInput';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdCircle } from 'react-icons/md';
import SectionWrap from '../../SectionWrap';
import { useNavigate } from 'react-router';

const StorySection = ({
  data,
  setData,
  title,
  setTitle,
  enqueueImageUpload,
  buttonColor,
}) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const itemsPerPage = 3; // Desktop: 3 items per page

  const handleAddStory = () => {
    const newKey = `story_${new Date().getTime()}`;
    setData((prev) => ({
      ...prev,
      [newKey]: {
        title: '',
        abstract: '',
        thumbnail: {
          src: 'https://blog.photobucket.com/hubfs/upload_pics_online.png',
          alt: '',
          caption: '',
        },
        posted_time: new Date(),
      },
    }));
  };

  const handleChange = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field === 'description' ? 'abstract' : field]: value,
        thumbnail: {
          ...prev[id].thumbnail,
          title: field === 'title' ? value : prev[id].title,
        },
      },
    }));
  };

  const handleImageUpload = (id, file) => {
    const tempUrl = URL.createObjectURL(file);
    setData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        thumbnail: {
          ...prev[id].thumbnail,
          src: tempUrl,
        },
      },
    }));
    enqueueImageUpload(
      `main_pages.story_overviews.${id}.thumbnail.src`,
      `main_pages/story_overviews/${id}/thumbnail.jpg`,
      file
    );
  };

  const deleteStory = (id) => {
    setData((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const sortedStories = Object.entries(data || {}).sort(
    (a, b) => new Date(b[1].posted_time) - new Date(a[1].posted_time)
  );
  const numberOfPages = Math.ceil(sortedStories.length / itemsPerPage);

  return (
    <SectionWrap borderColor={buttonColor} className="w-full">
      <TextInput
        className="w-full pt-20 font-bold text-2xl sm:text-[2.5rem] text-primary-title text-center outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề mục câu chuyện"
      />
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={handleAddStory}
          className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title text-sm md:text-base"
        >
          Thêm câu chuyện
        </button>
      </div>

      <div className="w-full pt-12 flex justify-center px-2 sm:px-4">
        <div className="w-full max-w-[1152px] h-128 relative">
          <button
            onClick={() => setPage(Math.max(page - 1, 0))}
            className={`w-11 h-11 absolute -left-6 top-54 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer z-10 ${numberOfPages <= 1 ? 'hidden' : ''} md:block`}
          >
            <IoIosArrowBack className="w-5 h-5 md:w-6 md:h-6 ml-2" />
          </button>
          <button
            onClick={() => setPage(Math.min(page + 1, numberOfPages - 1))}
            className={`w-11 h-11 absolute -right-6 top-54 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer z-10 ${numberOfPages <= 1 ? 'hidden' : ''} md:block`}
          >
            <IoIosArrowForward className="w-5 h-5 md:w-6 md:h-6 ml-3" />
          </button>

          <div className="w-full h-full relative overflow-hidden">
            <div
              className="w-[100000px] h-full flex transition-all duration-750 flex-col md:flex-row"
              style={{ marginLeft: `calc(${-288 * page} * var(--spacing))` }}
            >
              {sortedStories.map(([id, story]) => (
                <div key={id} className="w-88 mr-8 h-full">
                  <button
                    className="relative top-10 left-1 bg-red-500 text-white p-2 rounded-full z-9 hover:bg-red-600"
                    onClick={() => deleteStory(id)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="relative">
                    <ImageInput
                      handleImageUpload={(e) =>
                        handleImageUpload(id, e.target.files[0])
                      }
                      // className="w-full h-60 bg-cover bg-center rounded-sm"
                      // style={{
                      //   backgroundImage: `url("${story.thumbnail?.src}")`,
                      // }}
                      section="story"
                      top="top-2"
                      left="left-2"
                      className="w-full h-60 md:h-60 bg-no-repeat md:bg-cover md:bg-center rounded-lg"
                      style={{ backgroundImage: `url("${story?.thumbnail?.src}")` }}
                    />
                  </div>
                  <TextInput
                    className="w-full font-bold text-xl md:text-2xl pt-5 text-primary-title outline-none"
                    value={story.title}
                    onChange={(e) => handleChange(id, 'title', e.target.value)}
                    placeholder="Nhập tiêu đề câu chuyện"
                  />
                  <TextInput
                    type="textarea"
                    className="w-full text-sm md:text-base/5 py-5 text-primary-paragraph outline-none resize-none"
                    value={story.abstract}
                    onChange={(e) =>
                      handleChange(id, 'description', e.target.value)
                    }
                    placeholder="Nhập mô tả câu chuyện"
                    rows="4"
                  />
                  <button
                    className="font-semibold block mt-2 text-sm md:text-base"
                    style={{ color: buttonColor }}
                    onClick={() =>
                      navigate('/edit-content', {
                        state: { id, title: story.title, thumbnail: story.thumbnail.src },
                      })
                    }
                  >
                    Đọc thêm <IoIosArrowForward className="inline-block mb-0.5 ml-1 w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center">
            {Array.from({ length: numberOfPages }, (_, index) => (
              <MdCircle
                key={`dot_${index}`}
                className={`w-2.5 h-2.5 mx-0.5 ${
                  page === index ? 'text-secondary' : 'text-primary-darken-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrap>
  );
};

StorySection.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default StorySection;