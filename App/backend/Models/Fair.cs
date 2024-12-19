using System.Collections;
using System.Linq;

namespace backend.Models
{
    public class Fair(School school, string name, DateTime time)
    {
        public readonly int ID = school.GetHashCode() + name.GetHashCode();
        public readonly School School = school;
        public readonly string Name = name;
        public readonly DateTime Time = time;

        private readonly List<Guide> AssignedGuides = [];
        private readonly List<Comment> Comments = [];



        public bool AddGuide(Guide guide)
        {
            if (AssignedGuides.Contains(guide))
                return false;
            AssignedGuides.Add(guide);
            return true;
        }

        public bool RemoveCandidateGuide(Guide guide) => AssignedGuides.Remove(guide);

        public bool CandidateGuideAssigned(Guide guide) => AssignedGuides.Contains(guide);

        public void AddComment(Comment comment) => Comments.Add(comment);

        public void RemoveComment(int ID) => Comments.RemoveAll(c => c.ID == ID);

        public void RemoveAllComments() => Comments.Clear();

        public Comment[] GetComments() => Comments.ToArray();
    }
}
