// VisitorDatabaseController.cs
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Database
{
    public class VisitorDatabaseController
    {
        private readonly SystemDbContext _context;

        public VisitorDatabaseController(SystemDbContext context)
        {
            _context = context;
        }

        // Add a new visitor to the database
        public async Task<bool> AddVisitor(Visitor visitor)
        {
            try
            {
                if (visitor == null)
                {
                    return false;
                }
                bool visitorExists = await _context.Visitors.AnyAsync(v =>
                    v.Name == visitor.Name && v.City == visitor.City);
                
                if (visitorExists)
                {
                    return false;
                }

                await _context.Visitors.AddAsync(visitor);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        // Get a visitor by their ID
        public async Task<Visitor?> GetVisitorById(int id)
        {
            try
            {
                return await _context.Visitors.FirstOrDefaultAsync(v => v.ID == id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Get all visitors
        public async Task<List<Visitor>> GetAllVisitors()
        {
            try
            {
                return await _context.Visitors.ToListAsync();
            }
            catch (Exception)
            {
                return new List<Visitor>();
            }
        }
    }
}