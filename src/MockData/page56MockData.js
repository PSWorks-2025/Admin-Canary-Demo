export const mockData = {
  campaignTitle: "Ủng hộ Trường Học Vùng Cao",
  campaignDescription:
    "Chúng tôi đang gây quỹ để xây dựng trường học cho trẻ em vùng cao.",
  imageUrl: "https://picsum.photos/800/400",
  fundraiserName: "Quỹ Vì Tương Lai",
  amountRaised: 71530300,
  goalAmount: 100000000,
  qrCodeUrl: "https://picsum.photos/500",
  donors: [
    { name: "Nguyễn Văn A", amount: 1000000 },
    { name: "Trần Thị B", amount: 2000000 },
    { name: "Lê Văn C", amount: 1500000 },
  ],
  totalCollected: 15000000,
  totalSpent: 9000000,
  transactions: [
    { id: 1, type: "Thu", amount: 5000000, date: "01/02/2025" },
    { id: 2, type: "Chi", amount: 2000000, date: "02/02/2025" },
    { id: 3, type: "Thu", amount: 3000000, date: "03/02/2025" },
    { id: 4, type: "Chi", amount: 1000000, date: "04/02/2025" },
    { id: 5, type: "Thu", amount: 5000000, date: "05/02/2025" },
    { id: 6, type: "Chi", amount: 4000000, date: "06/02/2025" },
  ],
};

export const mockStory = {
  storyName: "Hành Trình Của Chúng Tôi",
  sections: [
    {
      title: "Khởi Đầu",
      content: "Câu chuyện bắt đầu từ một ngôi làng nhỏ...",
      layout: "textleft",
      animation: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
      },
      textAnimation: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, delay: 0.2 },
      },
      imageAnimation: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, delay: 0.2 },
      },
      image: {
        src: "https://picsum.photos/400/800",
        alt: "Một bức ảnh minh họa",
        caption: "Bắt đầu cuộc hành trình",
      },
    },
    {
      title: "Thử Thách",
      content: "Chúng tôi đối mặt với nhiều khó khăn...",
      layout: "textright",
      textAnimation: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, delay: 0.2 },
      },
      imageAnimation: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, delay: 0.2 },
      },
      image: {
        src: "https://picsum.photos/400/800",
        alt: "Một hình ảnh khác",
        caption: "Đối mặt thử thách",
      },
    },
  ],
};
