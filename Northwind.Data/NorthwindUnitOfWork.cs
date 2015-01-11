using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Northwind.RepositoryInterface;

namespace Northwind.Data
{
    public class NorthwindUnitOfWork : IUnitOfWork
    {
        private IDbContextFactory _contextFactory;
        private NORTHWNDDbContext _context;

        public NorthwindUnitOfWork(IDbContextFactory contextFactory)
        {
            if (contextFactory == null)
            {
                throw new ArgumentNullException("contextFactory");
            }

            _contextFactory = contextFactory;
        }

        protected NORTHWNDDbContext Context
        {
            get { return _context ?? (_context = _contextFactory.Get()); }
        }

        public void SaveChanges()
        {
            //Context.Commit();
            Context.SaveChanges();
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }

}
