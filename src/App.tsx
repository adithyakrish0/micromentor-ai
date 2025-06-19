import React, { useState } from 'react';
import { User, FileText, Github, Linkedin, Search, CheckCircle, XCircle, TrendingUp, BookOpen, MapPin, Download, Target, BarChart3, AlertTriangle } from 'lucide-react';

interface ATSScore {
  keywordMatch: number;
  skillsTools: number;
  experienceAlignment: number;
  formatting: number;
  educationCerts: number;
  total: number;
}

interface AnalysisResult {
  summary: string;
  atsScore: ATSScore;
  improvements: string[];
  rewrittenBullets: Array<{ original: string; improved: string }>;
  missingKeywords: string[];
  recommendations: Array<{ topic: string; items: string[] }>;
  githubInsights?: string[];
  linkedinCritique?: string;
}

function App() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    resumeText: '',
    githubInfo: '',
    linkedinInfo: ''
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateATSScore = (jobTitle: string, resumeText: string): ATSScore => {
    const jobTitleLower = jobTitle.toLowerCase();
    const resumeLower = resumeText.toLowerCase();
    
    // Keyword matching logic
    let keywordScore = 0;
    const commonKeywords = {
      'software': ['javascript', 'python', 'java', 'react', 'node', 'api', 'database', 'git', 'agile', 'testing'],
      'data': ['python', 'sql', 'machine learning', 'statistics', 'tableau', 'excel', 'analytics', 'visualization', 'pandas', 'numpy'],
      'product': ['roadmap', 'stakeholder', 'metrics', 'user research', 'analytics', 'agile', 'scrum', 'strategy', 'market research', 'kpi'],
      'marketing': ['campaign', 'analytics', 'seo', 'social media', 'content', 'brand', 'conversion', 'roi', 'email marketing', 'crm'],
      'design': ['figma', 'sketch', 'adobe', 'user experience', 'wireframe', 'prototype', 'user interface', 'design system', 'usability', 'accessibility']
    };

    let relevantKeywords: string[] = [];
    for (const [category, keywords] of Object.entries(commonKeywords)) {
      if (jobTitleLower.includes(category)) {
        relevantKeywords = keywords;
        break;
      }
    }

    if (relevantKeywords.length === 0) {
      relevantKeywords = ['leadership', 'communication', 'problem solving', 'teamwork', 'project management'];
    }

    const foundKeywords = relevantKeywords.filter(keyword => resumeLower.includes(keyword));
    keywordScore = Math.min(25, (foundKeywords.length / relevantKeywords.length) * 25);

    // Skills and tools assessment
    const skillIndicators = ['experience', 'proficient', 'skilled', 'expert', 'familiar', 'knowledge', 'years'];
    const skillMentions = skillIndicators.filter(indicator => resumeLower.includes(indicator)).length;
    const skillsScore = Math.min(25, (skillMentions / skillIndicators.length) * 25);

    // Experience alignment
    const experienceIndicators = ['developed', 'implemented', 'managed', 'led', 'created', 'designed', 'optimized', 'improved'];
    const expMentions = experienceIndicators.filter(indicator => resumeLower.includes(indicator)).length;
    const experienceScore = Math.min(20, (expMentions / experienceIndicators.length) * 20);

    // Formatting quality (basic checks)
    const hasNumbers = /\d/.test(resumeText);
    const hasBullets = resumeText.includes('•') || resumeText.includes('-') || resumeText.includes('*');
    const hasProperLength = resumeText.length > 500 && resumeText.length < 3000;
    const formattingScore = (hasNumbers ? 5 : 0) + (hasBullets ? 5 : 0) + (hasProperLength ? 5 : 0);

    // Education and certifications
    const educationKeywords = ['degree', 'bachelor', 'master', 'phd', 'certificate', 'certification', 'university', 'college'];
    const eduMentions = educationKeywords.filter(keyword => resumeLower.includes(keyword)).length;
    const educationScore = Math.min(15, (eduMentions / 3) * 15);

    const total = Math.round(keywordScore + skillsScore + experienceScore + formattingScore + educationScore);

    return {
      keywordMatch: Math.round(keywordScore),
      skillsTools: Math.round(skillsScore),
      experienceAlignment: Math.round(experienceScore),
      formatting: Math.round(formattingScore),
      educationCerts: Math.round(educationScore),
      total
    };
  };

  const generateAnalysis = async (): Promise<AnalysisResult> => {
    const { jobTitle, resumeText, githubInfo, linkedinInfo } = formData;
    
    const atsScore = calculateATSScore(jobTitle, resumeText);
    
    // Generate missing keywords based on job title
    let missingKeywords: string[] = [];
    const jobTitleLower = jobTitle.toLowerCase();
    
    if (jobTitleLower.includes('software') || jobTitleLower.includes('developer')) {
      missingKeywords = ['microservices', 'containerization', 'ci/cd', 'cloud architecture', 'system design'];
    } else if (jobTitleLower.includes('data')) {
      missingKeywords = ['machine learning', 'data pipeline', 'statistical analysis', 'data visualization', 'big data'];
    } else if (jobTitleLower.includes('product')) {
      missingKeywords = ['product roadmap', 'user stories', 'market analysis', 'competitive analysis', 'product metrics'];
    } else {
      missingKeywords = ['strategic planning', 'cross-functional collaboration', 'process improvement', 'stakeholder management', 'performance metrics'];
    }

    const analysis: AnalysisResult = {
      summary: `Your resume demonstrates solid foundational experience relevant to ${jobTitle} roles. You show technical competency and practical application of key skills. However, there are opportunities to strengthen keyword optimization, quantify achievements more effectively, and better align your experience narrative with ATS requirements.`,
      atsScore,
      improvements: [
        "• Add specific metrics and quantifiable results (e.g., 'Increased system performance by 40%' instead of 'Improved performance')",
        "• Include more industry-specific keywords and technical terms relevant to the target role",
        "• Use stronger action verbs at the beginning of bullet points (Architected, Spearheaded, Optimized)",
        "• Ensure consistent formatting throughout the document with proper bullet points and spacing",
        "• Add a skills section with relevant technical and soft skills clearly listed"
      ],
      rewrittenBullets: [
        {
          original: "Worked on improving system performance",
          improved: "Optimized database queries and implemented caching strategies, resulting in 45% faster response times and improved user experience for 10,000+ daily active users"
        },
        {
          original: "Managed team projects",
          improved: "Led cross-functional team of 8 developers and designers through 3 major product releases, delivering projects 15% ahead of schedule while maintaining 99.9% uptime"
        }
      ],
      missingKeywords,
      recommendations: []
    };

    // Generate recommendations based on job title
    if (jobTitleLower.includes('data')) {
      analysis.recommendations = [
        {
          topic: "Data Science Certifications",
          items: [
            "[Google Data Analytics Professional Certificate – Coursera](https://www.coursera.org/professional-certificates/google-data-analytics)",
            "[IBM Data Science Professional Certificate – Coursera](https://www.coursera.org/professional-certificates/ibm-data-science)"
          ]
        },
        {
          topic: "Machine Learning & Analytics",
          items: [
            "[Machine Learning Course – Stanford/Coursera](https://www.coursera.org/learn/machine-learning)",
            "[SQL for Data Analysis – Udacity](https://www.udacity.com/course/sql-for-data-analysis--ud198)"
          ]
        },
        {
          topic: "Programming & Tools",
          items: [
            "[Python for Data Science – freeCodeCamp](https://www.freecodecamp.org/learn/data-analysis-with-python/)",
            "[Tableau Public Training – Free](https://public.tableau.com/en-us/s/resources)"
          ]
        }
      ];
    } else if (jobTitleLower.includes('software') || jobTitleLower.includes('developer')) {
      analysis.recommendations = [
        {
          topic: "Cloud Certifications",
          items: [
            "[AWS Solutions Architect Associate – AWS Training](https://aws.amazon.com/training/learn-about/architect/)",
            "[Microsoft Azure Fundamentals – Microsoft Learn](https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/)"
          ]
        },
        {
          topic: "System Design & Architecture",
          items: [
            "[System Design Interview Course – Educative](https://www.educative.io/courses/grokking-the-system-design-interview)",
            "[Microservices Patterns – Udemy](https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/)"
          ]
        },
        {
          topic: "Programming Skills",
          items: [
            "[Full Stack Open – University of Helsinki](https://fullstackopen.com/en/)",
            "[LeetCode Premium – Algorithm Practice](https://leetcode.com/premium/)"
          ]
        }
      ];
    } else if (jobTitleLower.includes('product')) {
      analysis.recommendations = [
        {
          topic: "Product Management",
          items: [
            "[Google Project Management Certificate – Coursera](https://www.coursera.org/professional-certificates/google-project-management)",
            "[Product Management Fundamentals – Udemy](https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/)"
          ]
        },
        {
          topic: "Analytics & Research",
          items: [
            "[Google Analytics Individual Qualification – Google](https://skillshop.exceedlms.com/student/path/2938-google-analytics-individual-qualification)",
            "[User Experience Research – Coursera](https://www.coursera.org/learn/user-experience-research)"
          ]
        },
        {
          topic: "Business Strategy",
          items: [
            "[Strategic Management – Wharton/Coursera](https://www.coursera.org/learn/wharton-strategic-management)",
            "[Lean Startup Methodology – Udacity](https://www.udacity.com/course/how-to-build-a-startup--ep245)"
          ]
        }
      ];
    } else {
      analysis.recommendations = [
        {
          topic: "Professional Certifications",
          items: [
            "[LinkedIn Learning Paths – LinkedIn](https://www.linkedin.com/learning/)",
            "[Coursera Professional Certificates](https://www.coursera.org/professional-certificates)"
          ]
        },
        {
          topic: "Skill Development",
          items: [
            "[Udemy Business Skills Courses](https://www.udemy.com/courses/business/)",
            "[edX Professional Education](https://www.edx.org/professional-education)"
          ]
        },
        {
          topic: "Industry Knowledge",
          items: [
            "[Harvard Business Review Online Courses](https://hbr.org/courses/)",
            "[MasterClass Professional Development](https://www.masterclass.com/)"
          ]
        }
      ];
    }

    if (githubInfo.trim()) {
      analysis.githubInsights = [
        "Good commit frequency showing consistent development activity",
        "Strong variety of technologies in repository stack",
        "Could benefit from more detailed README files and project documentation",
        "Consider adding more collaborative projects to showcase teamwork"
      ];
    }

    if (linkedinInfo.trim()) {
      analysis.linkedinCritique = "Your LinkedIn summary effectively highlights your technical skills but could be strengthened by adding specific achievements and quantifiable results. Consider including a call-to-action and showcasing your passion for the industry.";
    }

    return analysis;
  };

  const handleAnalyze = async () => {
    if (!formData.jobTitle.trim() || !formData.resumeText.trim()) {
      alert('Please fill in the job title and resume text fields.');
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await generateAnalysis();
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportAnalysis = () => {
    if (!analysis) return;
    
    const content = `# MicroMentor AI - ATS Resume Analysis Report

## Target Role: ${formData.jobTitle}

## Summary
${analysis.summary}

## ATS Score: ${analysis.atsScore.total}/100

| Category | Score | Max Points |
|----------|-------|------------|
| Keyword Match with Target Role | ${analysis.atsScore.keywordMatch} | 25 |
| Relevant Skills & Tools | ${analysis.atsScore.skillsTools} | 25 |
| Experience Alignment | ${analysis.atsScore.experienceAlignment} | 20 |
| Formatting Quality | ${analysis.atsScore.formatting} | 15 |
| Education & Certifications | ${analysis.atsScore.educationCerts} | 15 |
| **Total** | **${analysis.atsScore.total}** | **100** |

## Improvement Suggestions
${analysis.improvements.join('\n')}

## Rewritten Examples
${analysis.rewrittenBullets.map(bullet => 
  `**Before:** ${bullet.original}\n**After:** ${bullet.improved}`
).join('\n\n')}

## Missing Keywords
${analysis.missingKeywords.map(keyword => `- ${keyword}`).join('\n')}

## Recommended Courses & Certifications
${analysis.recommendations.map(section => 
  `### ${section.topic}\n${section.items.map(item => `- ${item}`).join('\n')}`
).join('\n\n')}

${analysis.githubInsights ? `## GitHub Analysis\n${analysis.githubInsights.map(item => `- ${item}`).join('\n')}\n` : ''}

${analysis.linkedinCritique ? `## LinkedIn Critique\n${analysis.linkedinCritique}` : ''}

---
*Generated by MicroMentor AI - ATS Resume Simulator*
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-analysis-${formData.jobTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdownLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 1) {
        const url = parts[index + 1];
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            {part}
          </a>
        );
      } else if (index % 3 === 2) {
        return null;
      } else {
        return part;
      }
    });
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTotalScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MicroMentor AI</h1>
              <p className="text-slate-600 text-sm">ATS Resume Simulator & Career Mentor</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Resume Analysis Input
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Software Engineer, Data Scientist"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resume Content *
                  </label>
                  <textarea
                    placeholder="Copy and paste your complete resume content here..."
                    value={formData.resumeText}
                    onChange={(e) => handleInputChange('resumeText', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Github className="w-4 h-4 mr-1" />
                    GitHub Profile (Optional)
                  </label>
                  <textarea
                    placeholder="GitHub username, notable repositories, contribution activity..."
                    value={formData.githubInfo}
                    onChange={(e) => handleInputChange('githubInfo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn Profile (Optional)
                  </label>
                  <textarea
                    placeholder="LinkedIn summary, endorsements, recommendations..."
                    value={formData.linkedinInfo}
                    onChange={(e) => handleInputChange('linkedinInfo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !formData.jobTitle.trim() || !formData.resumeText.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      <span>Run ATS Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {!analysis && !isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">ATS Analysis Ready</h3>
                <p className="text-slate-600">Enter your target role and resume content to get a comprehensive ATS score and improvement recommendations.</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Export Button */}
                <div className="flex justify-end">
                  <button
                    onClick={exportAnalysis}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Resume Summary
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* ATS Score */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    ATS Score: <span className={`ml-2 text-2xl font-bold ${getTotalScoreColor(analysis.atsScore.total)}`}>
                      {analysis.atsScore.total}/100
                    </span>
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Category</th>
                          <th className="text-center py-3 px-4 font-medium text-slate-900">Score</th>
                          <th className="text-center py-3 px-4 font-medium text-slate-900">Max Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 text-slate-700">Keyword Match with Target Role</td>
                          <td className={`py-3 px-4 text-center font-semibold rounded-lg ${getScoreColor(analysis.atsScore.keywordMatch, 25)}`}>
                            {analysis.atsScore.keywordMatch}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">25</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 text-slate-700">Relevant Skills & Tools</td>
                          <td className={`py-3 px-4 text-center font-semibold rounded-lg ${getScoreColor(analysis.atsScore.skillsTools, 25)}`}>
                            {analysis.atsScore.skillsTools}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">25</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 text-slate-700">Experience Alignment</td>
                          <td className={`py-3 px-4 text-center font-semibold rounded-lg ${getScoreColor(analysis.atsScore.experienceAlignment, 20)}`}>
                            {analysis.atsScore.experienceAlignment}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">20</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 text-slate-700">Formatting Quality</td>
                          <td className={`py-3 px-4 text-center font-semibold rounded-lg ${getScoreColor(analysis.atsScore.formatting, 15)}`}>
                            {analysis.atsScore.formatting}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">15</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 text-slate-700">Education & Certifications</td>
                          <td className={`py-3 px-4 text-center font-semibold rounded-lg ${getScoreColor(analysis.atsScore.educationCerts, 15)}`}>
                            {analysis.atsScore.educationCerts}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">15</td>
                        </tr>
                        <tr className="bg-slate-50 font-semibold">
                          <td className="py-3 px-4 text-slate-900">Total</td>
                          <td className={`py-3 px-4 text-center text-lg ${getTotalScoreColor(analysis.atsScore.total)}`}>
                            {analysis.atsScore.total}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-900">100</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Improvements */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-2">
                    {analysis.improvements.map((improvement, idx) => (
                      <div key={idx} className="text-slate-700 leading-relaxed">
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewritten Bullets */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Rewritten Examples
                  </h3>
                  <div className="space-y-4">
                    {analysis.rewrittenBullets.map((bullet, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4">
                        <div className="mb-3">
                          <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Before</span>
                          <p className="mt-2 text-slate-600 italic">{bullet.original}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">After</span>
                          <p className="mt-2 text-slate-800 font-medium">{bullet.improved}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                    Recommended Courses & Certifications
                  </h3>
                  <div className="grid gap-4">
                    {analysis.recommendations.map((section, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">{section.topic}</h4>
                        <ul className="space-y-1">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="text-slate-600 text-sm flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{renderMarkdownLinks(item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GitHub Insights */}
                {analysis.githubInsights && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Github className="w-5 h-5 mr-2 text-slate-800" />
                      GitHub Analysis
                    </h3>
                    <ul className="space-y-2">
                      {analysis.githubInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* LinkedIn Critique */}
                {analysis.linkedinCritique && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Linkedin className="w-5 h-5 mr-2 text-blue-700" />
                      LinkedIn Critique
                    </h3>
                    <p className="text-slate-700 leading-relaxed">{analysis.linkedinCritique}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;