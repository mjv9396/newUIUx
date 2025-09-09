import { useState, useEffect } from 'react';
import { kycFormData } from '../forms/kyc';
import { validateKycVerificationForm } from '../formValidations/kycVerificationForm';
import usePost from './usePost';
import useFetch from './useFetch';
import { endpoints } from '../services/apiEndpoints';
import { GetUserId } from '../services/cookieStore';


const useKyc = () => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(kycFormData);
    const [activeStep, setActiveStep] = useState(2);

    // Verification states
    const [aadhaarVerified, setAadhaarVerified] = useState(false);
    const [panVerified, setPanVerified] = useState(false);

    // Business details states
    const [gstVerified, setGstVerified] = useState(false);
    const [cinVerified, setCinVerified] = useState(false);
    const [bussinessPanVerified, setBussinessPanVerified] = useState(false);

    // Director's states
    const [directorPanVerified, setDirectorPanVerified] = useState(false);
    const [directorAadhaarVerified, setDirectorAadhaarVerified] = useState(false);

    // API hooks for business details
    const {
        postData: saveBusinessDetails,
        loading: businessDetailsLoading,
        error: businessDetailsError
    } = usePost(endpoints.kyc.saveBusinessDetails);

    const {
        data: existingBusinessDetails,
        loading: fetchBusinessDetailsLoading,
        error: fetchBusinessDetailsError,
        fetchData: fetchBusinessDetails
    } = useFetch();

    // Load existing business details on component mount
    // useEffect(() => {
    //     const userId = GetUserId();
    //     if (userId) {
    //         fetchBusinessDetails(`${endpoints.kyc.getBusinessDetails}?userId=${userId}`);
    //     }
    // }, []);

    // Update form data when existing business details are fetched
    useEffect(() => {
        if (existingBusinessDetails?.success) {
            const data = existingBusinessDetails.data;
            setFormData(prev => ({
                ...prev,
                companyName: data.companyName || '',
                companyType: data.companyType || '',
                companyCategory: data.companyCategory || '',
                companyPhone: data.companyPhone || '',
                companyEmail: data.companyEmail || '',
                companyWebsite: data.companyWebsite || '',
                certInCompliant: data.isCertail ? 'yes' : 'no',
                directorName: data.directorName || ''
            }));
        }
    }, [existingBusinessDetails]);

    const processExistingDocuments = (documents) => {
        if (!Array.isArray(documents)) return;

        documents.forEach(doc => {
            switch (doc.documentType) {
                case "AADHAAR_CARD":
                    if (doc.verified) setAadhaarVerified(true);
                    break;
                case "PAN_CARD":
                    if (doc.verified) setPanVerified(true);
                    break;
                case "GST_CERTIFICATE":
                    if (doc.verified) setGstVerified(true);
                    break;
                case "CIN_CERTIFICATE":
                    if (doc.verified) setCinVerified(true);
                    break;
                case "BUSINESS_PAN":
                    if (doc.verified) setBussinessPanVerified(true);
                    break;
                case "DIRECTOR_PAN":
                    if (doc.verified) setDirectorPanVerified(true);
                    break;
                case "DIRECTOR_AADHAAR":
                    if (doc.verified) setDirectorAadhaarVerified(true);
                    break;
            }
        });
    };

    const saveBusinessDetailsData = async () => {
        const businessData = {
            companyName: formData.companyName,
            companyType: formData.companyType,
            companyCategory: formData.companyCategory,
            companyPhone: formData.companyPhone,
            companyEmail: formData.companyEmail,
            companyWebsite: formData.companyWebsite,
            isCertail: formData.certInCompliant === 'yes',
            directorName: formData.directorName || "" // This might come from other steps
        };

        try {
            await saveBusinessDetails(businessData);
            console.log('Business details saved successfully');
        } catch (error) {
            console.error('Error saving business details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Handle file inputs
        if (files && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Clear errors when user starts typing/selecting
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleStepChange = async (step) => {
        // If moving from Business Details step (step 3) and it's business KYC, save the data
        if (activeStep === 3 && formData.kycType === "business") {
            await saveBusinessDetailsData();
        }
        setActiveStep(step);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { errors: validationErrors, activeStep: errorStep } =
            validateKycVerificationForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setActiveStep(errorStep);
            return;
        }

        // Check if individual KYC requires verification
        if (formData.kycType === "individual") {
            if (!aadhaarVerified || !panVerified) {
                alert("Please verify both Aadhaar and PAN before submitting.");
                return;
            }
        }

        // Perform form submission logic here
        // Move to final step
        setActiveStep(formData.kycType === "individual" ? 4 : 8);
    };

    return {
        errors,
        setErrors,
        formData,
        setFormData,
        activeStep,
        setActiveStep,
        aadhaarVerified,
        setAadhaarVerified,
        panVerified,
        setPanVerified,
        gstVerified,
        setGstVerified,
        cinVerified,
        setCinVerified,
        bussinessPanVerified,
        setBussinessPanVerified,
        directorPanVerified,
        setDirectorPanVerified,
        directorAadhaarVerified,
        setDirectorAadhaarVerified,
        processExistingDocuments,
        saveBusinessDetailsData,
        businessDetailsLoading,
        businessDetailsError,
        existingBusinessDetails,
        fetchBusinessDetailsLoading,
        fetchBusinessDetailsError,
        fetchBusinessDetails,
        handleChange,
        handleStepChange,
        handleSubmit
    };
};

export default useKyc;