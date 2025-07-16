const fs = require('fs');
const path = require('path');

// ✅ Cấu trúc bạn muốn tạo
const structure = {
  Home: ['HeroSection', 'SoLieuNoiBat', 'EventsHighlight', 'StoriesHighlight'],
  AboutCanary: ['HeroSection', 'Mission', 'Vision', 'StoriesHighlight', 'Member', 'Timeline', 'ProjectsHighlight'],
  Events: ['HeroSection', 'ProjectOverview', 'RecentProjects', 'RecentEvents'],
  Story: ['HighlightStory', 'StoriesList'],
  Donate: ['DonateProgress', 'DonorList']
};

// ✅ BASE_PATH là thư mục hiện tại (cùng nơi đặt file script)
const BASE_PATH = __dirname; // Không thêm 'pages'

for (const [parent, children] of Object.entries(structure)) {
  children.forEach(child => {
    const dir = path.join(BASE_PATH, parent, child);
    fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, 'index.jsx');
    const componentName = child;

    const content = `
const ${componentName} = () => {
  return (
    <div>
      <h2>${componentName}</h2>
      <p>This is the ${componentName} section.</p>
    </div>
  );
};

export default ${componentName};
`.trim();

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Created: ${filePath}`);
  });
}
