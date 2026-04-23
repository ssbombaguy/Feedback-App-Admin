import { useState, useMemo, useRef, useEffect } from "react";
import { usePupils } from "../hooks/usePupils";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../api/api";
import styles from "./StudentsList.module.css";

function SearchableDropdown({ label, options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.filterGroup} ref={dropdownRef}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.customSelectWrapper}>
        <div className={styles.selectedDisplay} onClick={() => setIsOpen(!isOpen)}>
          {value || placeholder}
          <span className={styles.arrow}>{isOpen ? "▴" : "▾"}</span>
        </div>
        
        {isOpen && (
          <div className={styles.dropdownPanel}>
            <input 
              type="text" 
              className={styles.innerSearch} 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className={styles.optionsList}>
              <div className={styles.option} onClick={() => { onChange(""); setIsOpen(false); setSearch(""); }}>
                ALL {label}S
              </div>
              {filteredOptions.map((opt, i) => (
                <div key={i} className={styles.option} onClick={() => { onChange(opt); setIsOpen(false); setSearch(""); }}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentsList() {
  const { data: pupils, isLoading } = usePupils();
  const { data: cities } = useQuery({ queryKey: ["cities"], queryFn: adminAPI.getCities });
  const { data: schools } = useQuery({ queryKey: ["schools"], queryFn: adminAPI.getSchools });

  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  const cityTitles = useMemo(() => cities?.map(c => c.title) || [], [cities]);
  const schoolTitles = useMemo(() => {
    if (!selectedCity) return schools?.map(s => s.title) || [];
    const cityObj = cities?.find(c => c.title === selectedCity);
    return schools?.filter(s => s.city_id === cityObj?.id).map(s => s.title) || [];
  }, [selectedCity, schools, cities]);

  const filteredPupils = useMemo(() => {
    return pupils?.filter((p, index) => {
      const searchLower = globalSearch.toLowerCase();
      const rowNum = String(index + 1).padStart(2, "0");
      const date = new Date(p.createdAt).toLocaleDateString();
      
      const matchesGlobal = !globalSearch || 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower) ||
        p.city?.toLowerCase().includes(searchLower) ||
        p.school?.toLowerCase().includes(searchLower) ||
        rowNum.includes(searchLower) ||
        date.includes(searchLower);

      const matchesCity = !selectedCity || p.city === selectedCity;
      const matchesSchool = !selectedSchool || p.school === selectedSchool;

      return matchesGlobal && matchesCity && matchesSchool;
    }) || [];
  }, [pupils, globalSearch, selectedCity, selectedSchool]);

  if (isLoading) return <div className={styles.loadingState}>LOADING...</div>;

  return (
    <div className="fade-up">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>STUDENTS</h1>
          <div className={styles.count}>SHOWING <strong>{filteredPupils.length}</strong> USERS</div>
        </div>
      </div>

      <div className={styles.filterBar}>

        <div className={styles.filterGroup} style={{ flex: 2 }}>
          <label className={styles.filterLabel}>GLOBAL SEARCH</label>
          <input 
            type="text" 
            className={styles.mainSearchInput} 
            placeholder="Search names, emails, dates, IDs..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <SearchableDropdown 
          label="CITY"
          options={cityTitles}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="Select City"
        />

        <SearchableDropdown 
          label="SCHOOL"
          options={schoolTitles}
          value={selectedSchool}
          onChange={setSelectedSchool}
          placeholder="Select School"
        />

        {(globalSearch || selectedCity || selectedSchool) && (
          <button className={styles.clearBtn} onClick={() => { setGlobalSearch(""); setSelectedCity(""); setSelectedSchool(""); }}>
            RESET
          </button>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              <th className={styles.th}>STUDENT</th>
              <th className={styles.th}>EMAIL</th>
              <th className={styles.th}>CITY</th>
              <th className={styles.th}>SCHOOL</th>
              <th className={styles.th}>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {filteredPupils.map((student, i) => (
              <tr key={student.id || i} className={styles.tr}>
                <td className={styles.td}>{String(i + 1).padStart(2, "0")}</td>
                <td className={styles.td}>{student.firstName} {student.lastName}</td>
                <td className={styles.td}><span className={styles.email}>{student.email}</span></td>
                <td className={styles.td}>{student.city}</td>
                <td className={styles.td}>{student.school}</td>
                <td className={styles.td}>{new Date(student.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}