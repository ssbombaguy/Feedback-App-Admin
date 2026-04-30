import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseFeedbacks.module.css';
import { useFeedbacks, useDeleteFeedback } from '../hooks/useFeedbacks';
import { FeedbackModal, DeleteConfirmModal } from './modals';
import Toast from './ui/Toast';
import { useToast } from '../hooks/useToast';

export default function CourseFeedbacks() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(courseName);

  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { toast, showToast } = useToast();
  const { mutate: deleteFeedback } = useDeleteFeedback();
  const { data: allFeedbacks, isLoading, isError } = useFeedbacks();

  const feedbacks = allFeedbacks?.filter((fb) => fb.course_name === decoded) || [];

  const handleDelete = () => {
    deleteFeedback(deleteId, {
      onSuccess: () => { setDeleteId(null); showToast('success'); },
      onError:   () => { setDeleteId(null); showToast('error'); },
    });
  };

  const stats = {
    totalFeedbacks: feedbacks.length,
    returnAsTeacherCount: feedbacks.filter((f) => f.wants_to_return_as_teacher).length,
    anonymousCount: feedbacks.filter((f) => f.is_anonymous).length,
    returnAsTeacherPercentage: feedbacks.length
      ? Math.round(
          (feedbacks.filter((f) => f.wants_to_return_as_teacher).length / feedbacks.length) * 100
        )
      : 0,
  };

  return (
    <div>
      <div className={`${styles.pageHeader} fade-up`}>
        <div>
          <div className={styles.breadcrumb}>
            <button className={styles.backBtn} onClick={() => navigate('/admin/courses')}>
              ← COURSES
            </button>
            <span className={styles.sep}>/</span> FEEDBACKS
          </div>
          <h1 className={styles.pageTitle}>{decoded}</h1>
        </div>
      </div>

      {!isLoading && !isError && (
        <div className={`${styles.statsRow} fade-up fade-up-delay-1`}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>TOTAL FEEDBACKS</div>
            <div className={styles.statNum}>{stats.totalFeedbacks}</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>WOULD RETURN AS TEACHER</div>
            <div className={styles.statNum} style={{ color: 'var(--green)' }}>
              {stats.returnAsTeacherCount}{' '}
              <span className={styles.statPct}>({stats.returnAsTeacherPercentage}%)</span>
            </div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>SATISFACTION RATE</div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${stats.returnAsTeacherPercentage}%` }} />
            </div>
            <div className={styles.statPct}>{stats.returnAsTeacherPercentage}%</div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingBar} />
          <span>LOADING FEEDBACKS...</span>
        </div>
      )}

      {!isLoading && !isError && (
        <div className={`${styles.tableWrap} fade-up fade-up-delay-2`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}><span className={styles.thLabel}>#</span></th>
                <th className={styles.th}><span className={styles.thLabel}>STUDENT ID</span></th>
                <th className={styles.th}><span className={styles.thLabel}>EVALUATION PREVIEW</span></th>
                <th className={styles.th}><span className={styles.thLabel}>RETURN</span></th>
                <th className={styles.th} style={{ textAlign: 'right' }}>
                  <span className={styles.thLabel}>ACTIONS</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyRow}>NO FEEDBACKS FOUND</td>
                </tr>
              ) : (
                feedbacks.map((fb, i) => (
                  <tr key={fb.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.email}>{fb.is_anonymous ? '—' : fb.pupil_name}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.preview}>
                        {fb.course_evaluation_form?.substring(0, 30)}...
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={fb.wants_to_return_as_teacher ? styles.yesTag : styles.noTag}>
                        {fb.wants_to_return_as_teacher ? '✓ YES' : '✗ NO'}
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.actionGroup}>
                        <button className={styles.actionBtn} onClick={() => setSelected(fb)}>
                          DETAILS →
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setDeleteId(fb.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Toast
        type={toast}
        messages={{ success: '✓ FEEDBACK DELETED', error: '✗ FAILED TO DELETE' }}
      />

      <FeedbackModal feedback={selected} onClose={() => setSelected(null)} />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}