import pool from '../database/pool';

export const query = (query:string, variables:Array<any> = []):Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.query(query, variables, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      };
    });
  });
};
