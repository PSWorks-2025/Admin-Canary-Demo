import React, { useState, useContext, useEffect, useRef } from 'react';
import { TextInput } from '../../Inputs/TextInput';
import { ImageInput } from '../../Inputs/ImageInput';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdCircle } from 'react-icons/md';
import { generateNextId } from '../../../utils/idUtils';
import GlobalContext from '../../../GlobalContext';

const StorySection = ({ title, setTitle, buttonColor }) => {
  const { storyOverviews, setStoryOverviews, enqueueImageUpload } =
    useContext(GlobalContext);
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;

  const storyImageRefs = useRef({});

  useEffect(() => {
    // Maintain imageRefs per key
    Object.keys(storyOverviews).forEach((key) => {
      if (!storyImageRefs.current[key]) {
        storyImageRefs.current[key] = React.createRef();
      }
    });
    Object.keys(storyImageRefs.current).forEach((key) => {
      if (!storyOverviews[key]) {
        delete storyImageRefs.current[key];
      }
    });
  }, [storyOverviews]);

  const handleAddStory = () => {
    const id = generateNextId(storyOverviews, 'story');

    setStoryOverviews((prev) => ({
      ...prev,
      [id]: {
        id,
        title: '',
        abstract: '',
        thumbnail: {
          src: '',
          alt: '',
          caption: '',
        },
        posted_time: new Date(),
      },
    }));
  };

  const handleChange = (id, field, value) => {
    setStoryOverviews((prev) => ({
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
    if (!(file instanceof File)) return;
    const tempUrl = URL.createObjectURL(file);

    setStoryOverviews((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        thumbnail: {
          ...prev[id].thumbnail,
          src: tempUrl,
        },
      },
    }));

    enqueueImageUpload({
      key: `main_pages.story_overviews.${id}.thumbnail.src`,
      file,
      path: `main_pages/story_overviews/${id}/thumbnail.jpg`,
    });
  };

  const deleteStory = (id) => {
    setStoryOverviews((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const sortedStories = Object.entries(storyOverviews).sort(
    (a, b) => new Date(b[1].posted_time) - new Date(a[1].posted_time)
  );

  const numberOfPages = Math.ceil(sortedStories.length / itemsPerPage);
  const visibleStories = sortedStories.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <div className="w-full">
      <TextInput
        className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề mục câu chuyện"
      />
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={handleAddStory}
          className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
        >
          Thêm câu chuyện
        </button>
      </div>

      <div className="w-full pt-12 flex justify-center">
        <div className="w-280 h-112 relative">
          {/* Pagination buttons */}
          <button
            onClick={() => setPage(Math.max(page - 1, 0))}
            className="w-11 h-11 absolute -left-6 top-54 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer z-10"
          >
            <IoIosArrowBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage(Math.min(page + 1, numberOfPages - 1))}
            className="w-11 h-11 absolute -right-6 top-54 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer z-10"
          >
            <IoIosArrowForward className="w-5 h-5" />
          </button>

          {/* Carousel */}
          <div className="w-full h-full overflow-hidden">
            <div
              className="w-100000 h-full flex transition-all duration-750"
              style={{ marginLeft: `calc(${-288 * page} * var(--spacing))` }}
            >
              {sortedStories.map(([id, story]) => (
                <div key={id} className="w-88 mr-8 h-full relative">
                  {/* Delete button */}
                  <button
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full z-10"
                    onClick={() => deleteStory(id)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Thumbnail */}
                  <ImageInput
                    handleImageUpload={(e) =>
                      handleImageUpload(id, e.target.files[0])
                    }
                    className="w-full h-60 bg-cover bg-center rounded-sm"
                    imagePreview={story.thumbnail.src}
                    section="story"
                  />

                  {/* Title */}
                  <TextInput
                    className="w-full font-bold text-2xl pt-5 text-primary-title outline-none"
                    value={story.title}
                    onChange={(e) => handleChange(id, 'title', e.target.value)}
                    placeholder="Nhập tiêu đề câu chuyện"
                  />

                  {/* Abstract */}
                  <TextInput
                    type="textarea"
                    className="w-full text-base/5 py-5 text-primary-paragraph outline-none resize-none"
                    value={story.abstract}
                    onChange={(e) =>
                      handleChange(id, 'description', e.target.value)
                    }
                    placeholder="Nhập mô tả câu chuyện"
                    rows="4"
                  />

                  {/* CTA */}
                  <button
                    className="font-semibold block mt-2"
                    style={{ color: buttonColor }}
                  >
                    Đọc thêm{' '}
                    <IoIosArrowForward className="inline-block mb-0.5 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Page indicators */}
          <div className="absolute bottom-0 w-full flex justify-center">
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
    </div>
  );
};

export default StorySection;
