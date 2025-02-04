using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Transaction
    {
        public int TransactionId { get; set; }

        [Required(ErrorMessage = "Type is required")]
        public string Type { get; set; } // Income/Expense

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        public string UserId { get; set; } // Foreign Key
    }
}