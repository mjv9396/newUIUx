export default function BusinessDetails({ formData, handleChange, errors }) {
  const companyTypes = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "llp", label: "Limited Liability Partnership (LLP)" },
    { value: "pvt_ltd", label: "Private Limited Company (Pvt Ltd)" },
    { value: "plc", label: "Public Limited Company (PLC)" },
    { value: "llc", label: "Limited Liability Company (LLC)" },
    { value: "cooperative", label: "Cooperative (Co-op)" },
    { value: "corporation", label: "Corporation (C-Corp)" },
    { value: "s_corp", label: "S Corporation (S-Corp)" },
    { value: "non_profit", label: "Non-Profit Organization" },
    { value: "branch_office", label: "Branch Office" },
    { value: "joint_venture", label: "Joint Venture" },
    { value: "trust", label: "Trust" },
    { value: "franchise", label: "Franchise" },
    { value: "freelancer", label: "Freelancer/Independent Contractor" },
  ];

  const businessCategories = [
    { value: "retail", label: "Retail" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "finance_insurance", label: "Finance & Insurance" },
    { value: "education", label: "Education" },
    { value: "construction_real_estate", label: "Construction & Real Estate" },
    { value: "marketing_advertising", label: "Marketing & Advertising" },
    { value: "hospitality", label: "Hospitality" },
    { value: "professional_services", label: "Professional Services" },
    { value: "entertainment_media", label: "Entertainment & Media" },
    { value: "transportation_logistics", label: "Transportation & Logistics" },
    { value: "non_profit", label: "Non-Profit & NGOs" },
    { value: "agriculture", label: "Agriculture" },
    { value: "energy", label: "Energy" },
    { value: "legal_compliance", label: "Legal & Compliance" },
    { value: "art_design", label: "Art & Design" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="row mt-2">
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyName">
          Business Name <span className="required">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Enter business name"
          autoComplete="off"
          name="companyName"
          id="companyName"
          onChange={handleChange}
          value={formData.companyName}
        />
        {errors.companyName && (
          <span className="errors">{errors.companyName}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyType">
          Business Type <span className="required">*</span>
        </label>

        <select
          name="companyType"
          id="companyType"
          required
          onChange={handleChange}
          value={formData.companyType}
        >
          <option value="">Select business type</option>
          {companyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {errors.companyType && (
          <span className="errors">{errors.companyType}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyCategory">
          Business Category <span className="required">*</span>
        </label>

        <select
          name="companyCategory"
          id="companyCategory"
          required
          onChange={handleChange}
          value={formData.companyCategory}
        >
          <option value="">Select business category</option>
          {businessCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        {errors.companyCategory && (
          <span className="errors">{errors.companyCategory}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyPhone">
          Business Phone <span className="required">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Enter business phone"
          autoComplete="off"
          name="companyPhone"
          id="companyPhone"
          onChange={handleChange}
          value={formData.companyPhone}
        />
        {errors.companyPhone && (
          <span className="errors">{errors.companyPhone}</span>
        )}
      </div>

      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyEmail">
          Business Email <span className="required">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="Enter business email"
          autoComplete="off"
          name="companyEmail"
          id="companyEmail"
          onChange={handleChange}
          value={formData.companyEmail}
        />
        {errors.companyEmail && (
          <span className="errors">{errors.companyEmail}</span>
        )}
      </div>
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyWebsite">Business Website</label>
        <input
          type="text"
          required
          placeholder="Enter business website"
          autoComplete="off"
          name="companyWebsite"
          id="companyWebsite"
          onChange={handleChange}
          value={formData.companyWebsite}
        />
        {errors.companyWebsite && (
          <span className="errors">{errors.companyWebsite}</span>
        )}
      </div>
    </div>
  );
}
