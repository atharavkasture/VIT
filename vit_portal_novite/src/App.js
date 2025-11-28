import React, { useState, useMemo } from 'react';


// --- Helper Functions ---
const calculateGrade = (totalMarks) => {
  if (totalMarks >= 90) return 'S';
  if (totalMarks >= 80) return 'A';
  if (totalMarks >= 70) return 'B';
  if (totalMarks >= 60) return 'C';
  if (totalMarks >= 50) return 'D';
  if (totalMarks >= 40) return 'E';
  return 'F';
};

const getGradePoint = (grade) => {
  switch (grade) {
    case 'S': return 10;
    case 'A': return 9;
    case 'B': return 8;
    case 'C': return 7;
    case 'D': return 6;
    case 'E': return 5;
    case 'F': return 0;
    default: return 0;
  }
};

// --- React Components ---
const ResultRow = ({ result }) => {
  const grade = calculateGrade(result.total);
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
      <td className="py-3 px-4 text-left">{result.subject_code}</td>
      <td className="py-3 px-4 text-left font-medium">{result.subject_name}</td>
      <td className="py-3 px-4 text-center">{result.mse.toFixed(2)}</td>
      <td className="py-3 px-4 text-center">{result.ese.toFixed(2)}</td>
      <td className="py-3 px-4 text-center font-bold">{result.total.toFixed(2)}</td>
      <td className="py-3 px-4 text-center font-bold text-blue-600">{grade}</td>
    </tr>
  );
};

const ResultCard = ({ student, results }) => {
  const sgpa = useMemo(() => {
    if (!results || results.length === 0) return 0;

    let totalCredits = 0;
    let weightedGradePoints = 0;

    results.forEach(result => {
      const grade = calculateGrade(result.total);
      const gradePoint = getGradePoint(grade);
      totalCredits += result.credits;
      weightedGradePoints += gradePoint * result.credits;
    });

    return totalCredits > 0 ? (weightedGradePoints / totalCredits).toFixed(2) : 0;
  }, [results]);

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 mb-4">
        <div><p className="text-sm text-gray-500">Name</p><p className="font-bold text-lg text-gray-800">{student.name}</p></div>
        <div><p className="text-sm text-gray-500">PRN</p><p className="font-bold text-lg text-gray-800">{student.prnNo}</p></div>
        <div><p className="text-sm text-gray-500">Branch</p><p className="font-bold text-lg text-gray-800">{student.branch}</p></div>
        <div><p className="text-sm text-gray-500">Semester</p><p className="font-bold text-lg text-gray-800">{student.semester}</p></div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">MSE (30)</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">ESE (70)</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total (100)</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {results.map(result => <ResultRow key={result.subject_code} result={result} />)}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center bg-blue-50 p-4 rounded-lg">
        <p className="text-lg font-semibold text-gray-600">Semester Grade Point Average (SGPA)</p>
        <p className="text-4xl font-bold text-blue-600 mt-2">{sgpa}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [prn, setPrn] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetResult = async (e) => {
    e.preventDefault();
    if (!prn) {
      setError('Please enter a PRN.');
      return;
    }
    setLoading(true);
    setError('');
    setStudentData(null);
    setResults([]);

    try {
      // This calls your Spring Boot API via the Vite proxy!
      const response = await fetch(`/api/results/${prn}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(JSON.parse(errorText).message || `Student with PRN '${prn}' not found.`);
      }

      const data = await response.json();
      setStudentData(data.student);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const animationStyle = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div className="bg-gray-100 min-h-screen font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">VIT Student Result</h1>
            <p className="text-gray-600 mt-2">Enter your PRN to view your semester results.</p>
            <p className="text-sm text-gray-500 mt-1">
              (Test with PRNs: 12311686, 12311607, 12311698)
            </p>
          </header>

          <main className="bg-white p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleGetResult}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  placeholder="Enter your PRN"
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Get Result'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center animate-fade-in">
                {error}
              </div>
            )}

            {!error && studentData && (
              <ResultCard student={studentData} results={results} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}