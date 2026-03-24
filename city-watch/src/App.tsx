import { useMemo, useState } from "react";
import styles from "./App.module.css";
import { Info, Menu, MapPin, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./components/ui/ImageWithFallBack";

const MOCK_ISSUES = [
  {
    id: 1,
    category: 'Roads',
    title: 'Large Pothole on Main St',
    description: 'A deep pothole is causing cars to swerve. It\'s about 2 feet wide.',
    status: 'Pending',
    location: { lat: 40.7850, lng: -73.9680 },
    image: 'https://images.unsplash.com/photo-1709934730506-fba12664d4e4',
    timestamp: '2 hours ago',
    reports: 12
  },
  {
    id: 2,
    category: 'Lighting',
    title: 'Broken Street Light',
    description: 'The street light at the corner of 5th and Oak is completely out.',
    status: 'In Progress',
    location: { lat: 40.7800, lng: -73.9750 },
    image: 'https://images.unsplash.com/photo-1687812693663-c322b9af62a5',
    timestamp: '5 hours ago',
    reports: 4
  },
  {
    id: 3,
    category: 'Sanitation',
    title: 'Overflowing Trash Bins',
    description: 'Public bins haven\'t been emptied in a week. Trash is spilling onto the sidewalk.',
    status: 'Resolved',
    location: { lat: 40.7900, lng: -73.9600 },
    image: 'https://images.unsplash.com/photo-1762187547870-83fbeef1afcf',
    timestamp: '1 day ago',
    reports: 8
  },
  {
    id: 4,
    category: 'Vandalism',
    title: 'Graffiti on Library Wall',
    description: 'New graffiti appeared overnight on the historic brick wall.',
    status: 'Pending',
    location: { lat: 40.7750, lng: -73.9700 },
    image: 'https://images.unsplash.com/photo-1612706175704-43f68784522e',
    timestamp: '3 hours ago',
    reports: 2
  }
];
const CATEGORIES = ['All', 'Roads', 'Lighting', 'Sanitation', 'Vandalism', 'Parks', 'Other'];

export default function App() {
  // const apiKey = useMemo(
  //   () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  //   [],
  // )

  // return <GoogleMap apiKey={apiKey} />

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const filteredIssues = MOCK_ISSUES.filter(issue => {
    const matchesFilter = filter === 'All' || issue.category === filter;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={styles.menuButton}
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <Menu />
          </button>

          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <MapPin />
            </div>
            <h1 className={styles.logoText}>CityWatch</h1>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            onClick={() => setIsReporting(true)}
            className={styles.reportButton}
          >
            <Plus />
            <span>Report Issue</span>
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar / List View */}
        <motion.aside 
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 400 : 0,
            opacity: isSidebarOpen ? 1 : 0
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={styles.sidebar}
        >
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <div className={styles.searchContainer}>
                <Search />
                <input 
                  type="text" 
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={styles.filterTabs}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`${styles.filterTab} ${filter === cat ? styles.active : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.issuesList}>
              {filteredIssues.map(issue => (
                <motion.div
                  layout
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`${styles.issueCard} ${selectedIssue?.id === issue.id ? styles.selected : ''}`}
                >
                  <div className={styles.issueCardContent}>
                    <div className={styles.issueImage}>
                      <ImageWithFallback src={issue.image} alt={issue.title} />
                    </div>
                    <div className={styles.issueDetails}>
                      <div className={styles.issueHeader}>
                        <span className={styles.issueCategory}>
                          {issue.category}
                        </span>
                        <span className={styles.issueTimestamp}>
                          {issue.timestamp}
                        </span>
                      </div>
                      <h3 className={styles.issueTitle}>{issue.title}</h3>
                      <div className={styles.issueStatus}>
                        <StatusBadge status={issue.status} />
                      </div>
                      <div className={styles.issueReports}>
                        <div className={styles.avatarGroup}>
                          {[1,2,3].map(i => (
                            <div key={i} className={styles.avatar}>
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                        </div>
                        <span className={styles.reportCount}>+{issue.reports} others reported this</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredIssues.length === 0 && (
                <div className={styles.emptyState}>
                  <Info />
                  <p>No reports found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function StatusBadge({ status, size = 'sm' }: { status: string, size?: 'sm' | 'lg' }) {
  const statusClass = status === 'Pending' ? 'pending' : 
                      status === 'In Progress' ? 'inProgress' : 
                      status === 'Resolved' ? 'resolved' : 'pending';
  
  return (
    <span className={`${styles.statusBadge} ${styles[statusClass]} ${size === 'lg' ? styles.large : ''}`}>
      {status}
    </span>
  );
}
