import { useState } from 'react';
import { kycFormData } from '../forms/kyc';
import { validateKycVerificationForm } from '../formValidations/kycVerificationForm';


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

    const handleStepChange = (step) => {
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
        handleChange,
        handleStepChange,
        handleSubmit
    };
};

export default useKyc;