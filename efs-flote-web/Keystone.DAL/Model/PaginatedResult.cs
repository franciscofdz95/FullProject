namespace Keystone.DAL.Model
{
    public class PaginatedResult<T>
    {
        public int TotalRecords { get; set; }
        public List<T> Items { get; set; } = [];
    }
}