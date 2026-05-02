import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <header className="text-center p-10">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome to Eureka</h1>
        <p className="text-xl text-gray-700 mb-8">
          The best way to enhance your vocabulary and learn languages while browsing the web!
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          onClick={() => alert('Installation instructions coming soon!')}
        >
          Install Extension
        </button>
      </header>
    </div>
  )
}

export default App
