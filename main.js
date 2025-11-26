import React, { useState } from 'react';
import { Camera, Download, FileText } from 'lucide-react';

export default function ResumeGenerator() {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }],
    skills: '',
    certifications: ''
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e, section, index = null, field = null) => {
    if (index !== null && field) {
      const newData = [...formData[section]];
      newData[index][field] = e.target.value;
      setFormData({ ...formData, [section]: newData });
    } else {
      setFormData({ ...formData, [section]: e.target.value });
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', year: '', gpa: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExp });
  };

  const removeEducation = (index) => {
    const newEdu = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEdu });
  };

  const generateResume = () => {
    const processedData = { ...formData };
    
    // Fill in defaults if fields are empty
    if (!processedData.fullName) processedData.fullName = 'Your Full Name';
    if (!processedData.title) processedData.title = 'Professional Title';
    if (!processedData.email) processedData.email = 'email@example.com';
    if (!processedData.phone) processedData.phone = '+1 (555) 123-4567';
    if (!processedData.location) processedData.location = 'City, State';
    if (!processedData.summary) processedData.summary = 'Results-driven professional with expertise in delivering high-quality solutions and driving organizational success through innovative strategies and collaborative leadership.';
    
    // Process experience
    processedData.experience = processedData.experience.map(exp => ({
      company: exp.company || 'Company Name',
      position: exp.position || 'Job Title',
      duration: exp.duration || 'Jan 2020 - Present',
      description: exp.description || 'Led key initiatives and achieved measurable results through strategic planning and execution. Collaborated with cross-functional teams to deliver projects on time and within budget.'
    }));

    // Process education
    processedData.education = processedData.education.map(edu => ({
      institution: edu.institution || 'University Name',
      degree: edu.degree || 'Bachelor of Science in Business',
      year: edu.year || '2019',
      gpa: edu.gpa || '3.8/4.0'
    }));

    if (!processedData.skills) processedData.skills = 'Project Management, Team Leadership, Strategic Planning, Data Analysis, Communication';
    
    return processedData;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const resumeData = generateResume();
    const resumeElement = document.getElementById('resume-preview');
    const resumeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${resumeData.fullName} - Resume</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
          h1 { font-size: 28px; margin: 0; color: #1a1a1a; }
          h2 { font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #1a1a1a; padding-bottom: 5px; }
          h3 { font-size: 14px; font-weight: 600; margin: 0; }
          p { margin: 5px 0; line-height: 1.6; }
          .header { border-bottom: 2px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 20px; display: flex; gap: 20px; align-items: flex-start; }
          .header-text { flex: 1; }
          .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #ccc; }
          .title { font-size: 18px; color: #666; margin-top: 5px; }
          .contact { font-size: 12px; color: #666; margin-top: 10px; }
          .section { margin-bottom: 20px; }
          .job, .edu { margin-bottom: 15px; }
          .job-header, .edu-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .duration { font-size: 12px; color: #666; }
          .company { color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          ${photo ? `<img src="${photo}" class="photo" alt="Profile Photo" />` : ''}
          <div class="header-text">
            <h1>${resumeData.fullName}</h1>
            <p class="title">${resumeData.title}</p>
            <div class="contact">
              <p>${resumeData.email} | ${resumeData.phone}</p>
              <p>${resumeData.location}</p>
              ${resumeData.linkedin ? `<p>${resumeData.linkedin}</p>` : ''}
            </div>
          </div>
        </div>

        <div class="section">
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>${resumeData.summary}</p>
        </div>

        <div class="section">
          <h2>PROFESSIONAL EXPERIENCE</h2>
          ${resumeData.experience.map(exp => `
            <div class="job">
              <div class="job-header">
                <div>
                  <h3>${exp.position}</h3>
                  <p class="company">${exp.company}</p>
                </div>
                <p class="duration">${exp.duration}</p>
              </div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>EDUCATION</h2>
          ${resumeData.education.map(edu => `
            <div class="edu">
              <div class="edu-header">
                <div>
                  <h3>${edu.degree}</h3>
                  <p class="company">${edu.institution}</p>
                </div>
                <p class="duration">${edu.year}</p>
              </div>
              ${edu.gpa ? `<p style="font-size: 12px;">GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>SKILLS</h2>
          <p>${resumeData.skills}</p>
        </div>

        ${resumeData.certifications ? `
          <div class="section">
            <h2>CERTIFICATIONS</h2>
            <p>${resumeData.certifications}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resumeData = generateResume();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 h-fit">
          <div className="flex items-center gap-3 border-b pb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Profile Photo</label>
            <div className="flex items-center gap-4">
              {photo && (
                <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
              )}
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-gray-800">Personal Information</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange(e, 'fullName')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Professional Title"
              value={formData.title}
              onChange={(e) => handleInputChange(e, 'title')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange(e, 'phone')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleInputChange(e, 'location')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="LinkedIn Profile"
              value={formData.linkedin}
              onChange={(e) => handleInputChange(e, 'linkedin')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg text-gray-800">Professional Summary</h2>
            <textarea
              placeholder="Brief professional summary..."
              value={formData.summary}
              onChange={(e) => handleInputChange(e, 'summary')}
              rows="4"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">Experience</h2>
              <button onClick={addExperience} className="text-blue-600 hover:text-blue-700 text-sm font-medium">+ Add</button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'company')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'position')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                  value={exp.duration}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'duration')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <textarea
                  placeholder="Description and achievements..."
                  value={exp.description}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'description')}
                  rows="3"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {formData.experience.length > 1 && (
                  <button onClick={() => removeExperience(index)} className="text-red-600 text-sm">Remove</button>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">Education</h2>
              <button onClick={addEducation} className="text-blue-600 hover:text-blue-700 text-sm font-medium">+ Add</button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleInputChange(e, 'education', index, 'institution')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleInputChange(e, 'education', index, 'degree')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => handleInputChange(e, 'education', index, 'year')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) => handleInputChange(e, 'education', index, 'gpa')}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {formData.education.length > 1 && (
                  <button onClick={() => removeEducation(index)} className="text-red-600 text-sm">Remove</button>
                )}
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg text-gray-800">Skills</h2>
            <textarea
              placeholder="Comma-separated skills (e.g., Python, Project Management, Leadership)"
              value={formData.skills}
              onChange={(e) => handleInputChange(e, 'skills')}
              rows="3"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg text-gray-800">Certifications (Optional)</h2>
            <textarea
              placeholder="List certifications..."
              value={formData.certifications}
              onChange={(e) => handleInputChange(e, 'certifications')}
              rows="3"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download HTML
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold"
            >
              <FileText className="w-5 h-5" />
              Print to PDF
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none" id="resume-preview">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 flex items-start gap-6">
              {photo && (
                <img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{resumeData.fullName}</h1>
                <p className="text-xl text-gray-600 mt-1">{resumeData.title}</p>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>{resumeData.email} | {resumeData.phone}</p>
                  <p>{resumeData.location}</p>
                  {resumeData.linkedin && <p>{resumeData.linkedin}</p>}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">PROFESSIONAL SUMMARY</h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">PROFESSIONAL EXPERIENCE</h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <p className="text-sm text-gray-600">{exp.duration}</p>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">EDUCATION</h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-gray-600">{edu.year}</p>
                  </div>
                  {edu.gpa && <p className="text-gray-700 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">SKILLS</h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.skills}</p>
            </div>

            {/* Certifications */}
            {resumeData.certifications && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">CERTIFICATIONS</h2>
                <p className="text-gray-700 leading-relaxed">{resumeData.certifications}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
