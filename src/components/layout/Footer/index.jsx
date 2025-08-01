import { useContext } from 'react';
import FooterContactInfo from './components/FooterContactInfo';
import FooterSocialLinks from './components/FooterSocialLinks';
import GlobalContext from '../../../GlobalContext';
import FooterLogoAndGroupInfo from './components/FooterLogoAndGroupInfo';

const Footer = () => {
  const {
    secondaryBackgroundColor,
    logoUrl,
    setLogoUrl,
    setLogoFile,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
    contactInfoData,
    setContactInfoData,
    socialLinksData,
    setSocialLinksData,
  } = useContext(GlobalContext);

  return (
    <div
      className="w-full mx-auto px-2 sm:px-4 py-8 text-secondary-paragraph"
      style={{ backgroundColor: secondaryBackgroundColor }}
    >
      <div className="w-full flex justify-center mb-4"></div>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 px-2 sm:px-4 mb-6 md:mb-0">
          <FooterLogoAndGroupInfo
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            setLogoFile={setLogoFile}
            groupName={groupName}
            setGroupName={setGroupName}
            groupDescription={groupDescription}
            setGroupDescription={setGroupDescription}
          />
          <FooterContactInfo
            contactInfoData={contactInfoData}
            setContactInfoData={setContactInfoData}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 sm:px-4">
          <FooterSocialLinks
            socialLinksData={socialLinksData}
            setSocialLinksData={setSocialLinksData}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
