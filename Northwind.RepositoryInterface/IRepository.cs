﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Northwind.RepositoryInterface
{
    public interface IRepository<TEntity> where TEntity : class
    {

        //RETRIEVE METHODS
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter);
        IQueryable<TEntity> Get();

        //MODIFICATION METHODS
        void Add(TEntity entity);
        void Delete(object id);
        void Delete(TEntity entityToDelete);
        void Update(TEntity entityToUpdate);

        //SAVE is not implelented in the repository
        //   because we might want to commit changes to the database from 
        //   multiple repositories, save is called from the EfUnitOfWork
    }
}
