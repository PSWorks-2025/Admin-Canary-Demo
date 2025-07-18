import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";
import FooterContactInfo from "./Footer/components/FooterContactInfo";
import FooterLogoAndGroupInfo from "./Footer/components/FooterLogoAndGroupInfo";
import FooterSocialLinks from "./Footer/components/FooterSocialLinks";

const Footer = ({ tertiaryBackgroundColor, globalData, setGlobalData }) => {
  // Split into sections
  const [logoAndGroupData, setLogoAndGroupData] = useState({
    group_name: globalData?.group_name || "",
    description: globalData?.description || "",
    logo_footer: globalData?.logo_footer || "",
  });

  const [contactInfoData, setContactInfoData] = useState({
    hotline: globalData?.hotline || "",
    email: globalData?.email || "",
    address: globalData?.address || "",
  });

  const [socialLinksData, setSocialLinksData] = useState(globalData?.social_media || {});

    // General update function (only merged once per update)
  const updateGlobalData = useCallback(
    async (mergedData) => {
      try {
        setGlobalData(mergedData);
        const docRef = doc(db, "Global", "components");
        await updateDoc(docRef, mergedData);
        console.log("Global data updated in Firestore:", mergedData);
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    },
    [setGlobalData]
  );

  // Watch all section-local states and sync when any changes
  useEffect(() => {
    const merged = {
      ...logoAndGroupData,
      ...contactInfoData,
      social_media: socialLinksData,
    };
    updateGlobalData(merged);
  }, [logoAndGroupData, contactInfoData, socialLinksData, updateGlobalData]);

  return (
    <div
      className="w-full px-10 py-8 text-secondary-paragraph"
      style={{ backgroundColor: tertiaryBackgroundColor }}
    >
      <div className="w-full flex justify-center mb-4"></div>
      <div className="w-full flex">
        <div className="w-1/2 px-10">
          <FooterLogoAndGroupInfo
            data={logoAndGroupData}
            setData={setLogoAndGroupData}
            updateGlobalData={updateGlobalData}
          />
          <FooterContactInfo
            data={contactInfoData}
            setData={setContactInfoData}
            updateGlobalData={updateGlobalData}
          />
        </div>
        <div className="w-1/2 px-10">
          <FooterSocialLinks
            data={socialLinksData}
            setData={setSocialLinksData}
            updateGlobalData={updateGlobalData}
          />
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  tertiaryBackgroundColor: PropTypes.string,
  globalData: PropTypes.shape({
    group_name: PropTypes.string,
    description: PropTypes.string,
    hotline: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    logo_footer: PropTypes.string,
    social_media: PropTypes.object,
  }),
  setGlobalData: PropTypes.func,
};

export default Footer;
