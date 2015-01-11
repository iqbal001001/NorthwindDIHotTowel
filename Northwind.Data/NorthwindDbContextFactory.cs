using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Northwind.RepositoryInterface;


namespace Northwind.Data
{

    public interface IDbContextFactory
    {
        NORTHWNDDbContext Get();
    }
    public class NorthwindDbContextFactory : IDbContextFactory
    {
        private NORTHWNDDbContext _context;

        public NORTHWNDDbContext Get()
        {
            if (_context == null) InitialiseContext();

            return _context;
        }

        private void InitialiseContext()
        {

            //When Using SQLDeploy, we want to update the database ourselves.
            //System.Data.Entity.Database.SetInitializer<MusicStoreDbContext>(null);

            //To Use CodeFirst and have it create the sample data ..  this initialiser will create the database and insert sample data.
            //System.Data.Entity.Database.SetInitializer<NORTHWNDDbContext>(new MusicStoreDbInitializer());
            //once up and running, use the following
            //System.Data.Entity.Database.SetInitializer<MusicStoreDbContext>(null);

            //this is a sample of an alternative method
            //System.Data.Entity.Database.SetInitializer<MusicStoreEntities>(new CreateDatabaseIfNotExists<MusicStoreEntities>());

            _context = new NORTHWNDDbContext();
        }
    }
}
