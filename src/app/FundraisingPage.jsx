import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import PropTypes from 'prop-types';
import useImagePreloader from '../hooks/useImagePreloader';
import LoadingScreen from '../components/screens/LoadingScreen';
import FundraisingHeader from '../components/FundraisingHeader';
import DonorList from '../components/DonorList';
import TransactionList from '../components/TransactionList';
import { db, storage } from '../service/firebaseConfig.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextInput } from '../components/Inputs/TextInput.jsx';
import GlobalContext from '../GlobalData.jsx';

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const FundraisingPage = () => {
  const {
    mainData,
    setMainData,
    primaryBackgroundColor,
    secondaryBackgroundColor,
  } = useContext(GlobalContext);
  const [localData, setLocalData] = useState({
    campaignTitle: mainData.fundraising?.campaign_title || '',
    campaignDescription: mainData.fundraising?.campaign_description || '',
    fundraiserName: mainData.fundraising?.fundraiser_name || '',
    imageUrl:
      mainData.fundraising?.image_url || 'https://picsum.photos/800/400',
    qrCodeUrl: mainData.fundraising?.qr_code_url || 'https://picsum.photos/500',
    amountRaised: mainData.fundraising?.amount_raised || 0,
    goalAmount: mainData.fundraising?.goal_amount || 0,
    donors: (mainData.fundraising?.donors || []).map((donor) => ({
      ...donor,
      id: donor.id || Math.random().toString(36).substr(2, 9),
    })),
    totalCollected: mainData.fundraising?.total_collected || 0,
    totalSpent: mainData.fundraising?.total_spent || 0,
    transactions: (mainData.fundraising?.transactions || []).map((tx) => ({
      ...tx,
      date:
        tx.date instanceof Timestamp
          ? tx.date.toDate().toISOString().split('T')[0]
          : tx.date || '',
    })),
  });

  const imagesLoaded = useImagePreloader([
    localData.imageUrl,
    localData.qrCodeUrl,
  ]);

  // Sync localData with mainData changes
  useEffect(() => {
    setLocalData((prev) => ({
      ...prev,
      campaignTitle: mainData.fundraising?.campaign_title || prev.campaignTitle,
      campaignDescription:
        mainData.fundraising?.campaign_description || prev.campaignDescription,
      fundraiserName:
        mainData.fundraising?.fundraiser_name || prev.fundraiserName,
      imageUrl: mainData.fundraising?.image_url || prev.imageUrl,
      qrCodeUrl: mainData.fundraising?.qr_code_url || prev.qrCodeUrl,
      amountRaised: mainData.fundraising?.amount_raised || prev.amountRaised,
      goalAmount: mainData.fundraising?.goal_amount || prev.goalAmount,
      donors: (mainData.fundraising?.donors || prev.donors).map((donor) => ({
        ...donor,
        id: donor.id || Math.random().toString(36).substr(2, 9),
      })),
      totalCollected:
        mainData.fundraising?.total_collected || prev.totalCollected,
      totalSpent: mainData.fundraising?.total_spent || prev.totalSpent,
      transactions: (
        mainData.fundraising?.transactions || prev.transactions
      ).map((tx) => ({
        ...tx,
        date:
          tx.date instanceof Timestamp
            ? tx.date.toDate().toISOString().split('T')[0]
            : tx.date || '',
      })),
    }));
    console.log('localData synced with mainData:', mainData.fundraising);
  }, [mainData.fundraising]);

  // Calculate totals
  useEffect(() => {
    const amountRaised = localData.donors.reduce(
      (sum, donor) => sum + (donor.amount || 0),
      0
    );
    const totalCollected = localData.transactions
      .filter((tx) => tx.type === 'Thu')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalSpent = localData.transactions
      .filter((tx) => tx.type === 'Chi')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    if (
      amountRaised !== localData.amountRaised ||
      totalCollected !== localData.totalCollected ||
      totalSpent !== localData.totalSpent
    ) {
      setLocalData((prev) => ({
        ...prev,
        amountRaised,
        totalCollected,
        totalSpent,
      }));
      debouncedUpdateMainData({
        fundraising: {
          ...mainData.fundraising,
          amount_raised: amountRaised,
          total_collected: totalCollected,
          total_spent: totalSpent,
        },
      });
    }
    console.log('Totals calculated:', {
      amountRaised,
      totalCollected,
      totalSpent,
    });
  }, [localData.donors, localData.transactions]);

  // Normalize transactions.date to Timestamps
  useEffect(() => {
    if (
      mainData.fundraising?.transactions?.some(
        (tx) => tx.date && !(tx.date instanceof Timestamp)
      )
    ) {
      const normalizedTransactions = mainData.fundraising.transactions.map(
        (tx) => ({
          ...tx,
          date:
            tx.date && typeof tx.date === 'string'
              ? Timestamp.fromDate(new Date(tx.date))
              : tx.date || null,
        })
      );
      updateMainData({
        fundraising: {
          ...mainData.fundraising,
          transactions: normalizedTransactions,
        },
      });
    }
    console.log('mainData.fundraising:', mainData.fundraising);
  }, [mainData.fundraising]);

  // Merge utility for nested objects
  const mergeNested = useCallback((target, source) => {
    const output = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        !(source[key] instanceof Timestamp) &&
        !(source[key] instanceof Date)
      ) {
        output[key] = mergeNested(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }, []);

  const updateMainData = async (updates) => {
    try {
      let updatedData;
      setMainData((prev) => {
        updatedData = mergeNested(prev, updates);
        console.log('setMainData called with:', updatedData);
        return updatedData;
      });
      const docRef = doc(db, 'Main pages', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully:', updatedData);
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setMainData(mainData); // Revert on error
    }
  };

  // Debounced updateMainData (increased to 1000ms)
  const debouncedUpdateMainData = useCallback(debounce(updateMainData, 1000), [
    mainData,
    setMainData,
  ]);

  const handleFieldChange = useCallback(
    async (field, value) => {
      console.log('handleFieldChange:', { field, value });
      setLocalData((prev) => ({
        ...prev,
        [field]: field === 'goalAmount' ? Number(value) || 0 : value,
      }));
      await debouncedUpdateMainData({
        fundraising: {
          ...mainData.fundraising,
          [field === 'campaignTitle'
            ? 'campaign_title'
            : field === 'campaignDescription'
            ? 'campaign_description'
            : field === 'fundraiserName'
            ? 'fundraiser_name'
            : field === 'goalAmount'
            ? 'goal_amount'
            : field]: field === 'goalAmount' ? Number(value) || 0 : value,
        },
      });
    },
    [mainData.fundraising, debouncedUpdateMainData]
  );

  const handleImageUpload = useCallback(
    async (field, file) => {
      if (file instanceof File || file instanceof Blob) {
        try {
          const storageRef = ref(storage, `fundraising/${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);
          setLocalData((prev) => ({ ...prev, [field]: downloadUrl }));
          await updateMainData({
            fundraising: {
              ...mainData.fundraising,
              [field === 'imageUrl' ? 'image_url' : 'qr_code_url']: downloadUrl,
            },
          });
        } catch (error) {
          console.error(`Error uploading image for ${field}:`, error);
        }
      } else {
        console.error(`Invalid file for ${field}:`, file);
      }
    },
    [mainData.fundraising]
  );

  const handleDonorChange = useCallback(
    async (index, field, value) => {
      console.log('handleDonorChange:', { index, field, value });
      const newDonors = [...localData.donors];
      newDonors[index] = {
        ...newDonors[index],
        [field]: field === 'amount' ? Number(value) || 0 : value,
      };
      setLocalData((prev) => ({ ...prev, donors: newDonors }));
      await debouncedUpdateMainData({
        fundraising: {
          ...mainData.fundraising,
          donors: newDonors,
        },
      });
    },
    [localData.donors, mainData.fundraising, debouncedUpdateMainData]
  );

  const addDonor = useCallback(async () => {
    const newId =
      localData.donors.length > 0
        ? Math.max(...localData.donors.map((donor) => donor.id || 0)) + 1
        : 1;
    const newDonor = { id: newId, name: '', amount: 0 };
    setLocalData((prev) => ({ ...prev, donors: [...prev.donors, newDonor] }));
    await updateMainData({
      fundraising: {
        ...mainData.fundraising,
        donors: [...(mainData.fundraising?.donors || []), newDonor],
      },
    });
    console.log('New donor added:', newDonor);
  }, [localData.donors, mainData.fundraising]);

  const deleteDonor = useCallback(
    async (index) => {
      console.log(`Deleting donor at index ${index}`);
      const newDonors = localData.donors.filter((_, i) => i !== index);
      setLocalData((prev) => ({ ...prev, donors: newDonors }));
      await updateMainData({
        fundraising: {
          ...mainData.fundraising,
          donors: newDonors,
        },
      });
    },
    [localData.donors, mainData.fundraising]
  );

  const handleTransactionChange = useCallback(
    async (index, field, value) => {
      console.log('handleTransactionChange:', { index, field, value });
      const newTransactions = [...localData.transactions];
      newTransactions[index] = {
        ...newTransactions[index],
        [field]: field === 'amount' ? Number(value) || 0 : value,
      };
      setLocalData((prev) => ({ ...prev, transactions: newTransactions }));
      await debouncedUpdateMainData({
        fundraising: {
          ...mainData.fundraising,
          transactions: newTransactions.map((tx) => ({
            ...tx,
            date: tx.date ? Timestamp.fromDate(new Date(tx.date)) : null,
          })),
        },
      });
    },
    [localData.transactions, mainData.fundraising, debouncedUpdateMainData]
  );

  const addTransaction = useCallback(async () => {
    const newId =
      localData.transactions.length > 0
        ? Math.max(...localData.transactions.map((tx) => tx.id)) + 1
        : 1;
    const today = new Date().toISOString().split('T')[0];
    const newTransaction = { id: newId, type: 'Thu', amount: 0, date: today };
    setLocalData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
    await updateMainData({
      fundraising: {
        ...mainData.fundraising,
        transactions: [
          ...(mainData.fundraising?.transactions || []),
          { ...newTransaction, date: Timestamp.fromDate(new Date(today)) },
        ],
      },
    });
    console.log('New transaction added:', newTransaction);
  }, [localData.transactions, mainData.fundraising]);

  const deleteTransaction = useCallback(
    async (index) => {
      console.log(`Deleting transaction at index ${index}`);
      const newTransactions = localData.transactions.filter(
        (_, i) => i !== index
      );
      setLocalData((prev) => ({ ...prev, transactions: newTransactions }));
      await updateMainData({
        fundraising: {
          ...mainData.fundraising,
          transactions: newTransactions.map((tx) => ({
            ...tx,
            date: tx.date ? Timestamp.fromDate(new Date(tx.date)) : null,
          })),
        },
      });
    },
    [localData.transactions, mainData.fundraising]
  );

  const handleSupportClick = () => {
    alert('Cảm ơn bạn đã ủng hộ! 🎉');
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{ backgroundColor: primaryBackgroundColor }}
      className="min-h-screen relative overflow-hidden p-6"
    >
      {/* Header with Background Image and Progress */}
      <FundraisingHeader
        imageUrl={localData.imageUrl}
        fundraiserName={localData.fundraiserName}
        amountRaised={localData.amountRaised}
        goalAmount={localData.goalAmount}
        qrCodeUrl={localData.qrCodeUrl}
        onSupportClick={handleSupportClick}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
        buttonColor={secondaryBackgroundColor}
      />

      {/* Campaign Details */}
      <div className="mt-6 px-6 max-w-2xl mx-auto">
        <TextInput
          className="text-4xl font-bold text-gray-900 outline-none bg-transparent w-full border rounded px-2 py-1"
          value={localData.campaignTitle}
          onChange={(e) => handleFieldChange('campaignTitle', e.target.value)}
          placeholder="Nhập tiêu đề chiến dịch"
        />
        <TextInput
          type="textarea"
          className="text-gray-700 mt-2 outline-none bg-transparent resize-none w-full border rounded px-2 py-1"
          value={localData.campaignDescription}
          onChange={(e) =>
            handleFieldChange('campaignDescription', e.target.value)
          }
          placeholder="Nhập mô tả chiến dịch"
          rows="4"
        />
      </div>

      {/* Donors List */}
      <DonorList
        donors={localData.donors}
        handleDonorChange={handleDonorChange}
        addDonor={addDonor}
        deleteDonor={deleteDonor}
        buttonColor={secondaryBackgroundColor}
      />

      {/* Transactions List */}
      {/* <TransactionList
        transactions={localData.transactions}
        handleTransactionChange={handleTransactionChange}
        addTransaction={addTransaction}
        deleteTransaction={deleteTransaction}
        buttonColor={secondaryBackgroundColor}
      /> */}
    </div>
  );
};

FundraisingPage.propTypes = {
  campaignTitle: PropTypes.string,
  campaignDescription: PropTypes.string,
  imageUrl: PropTypes.string,
  fundraiserName: PropTypes.string,
  amountRaised: PropTypes.number,
  goalAmount: PropTypes.number,
  qrCodeUrl: PropTypes.string,
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
  totalCollected: PropTypes.number,
  totalSpent: PropTypes.number,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ),
};

export default FundraisingPage;
