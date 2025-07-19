import { useContext } from 'react';
import FooterContactInfo from './Footer/components/FooterContactInfo';
import FooterSocialLinks from './Footer/components/FooterSocialLinks';
import GlobalContext from '../../GlobalData';
import FooterLogoAndGroupInfo from './Footer/components/FooterLogoAndGroupInfo';

const Footer = () => {
  const {
    tertiaryBackgroundColor,
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
      className="w-full px-10 py-8 text-secondary-paragraph"
      style={{ backgroundColor: tertiaryBackgroundColor }}
    >
      <div className="w-full flex justify-center mb-4"></div>
      <div className="w-full flex">
        <div className="w-1/2 px-10">
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
        <div className="w-1/2 px-10">
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
