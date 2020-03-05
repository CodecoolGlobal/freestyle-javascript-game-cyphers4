from psycopg2.extras import RealDictCursor
import database


@database.connection_handler
def db_mod_list_with_return(cursor: RealDictCursor, query, list_of_var) -> list:
    cursor.execute(query, list_of_var)
    return cursor.fetchall()


@database.connection_handler
def db_mod_list_without_return(cursor: RealDictCursor, query, list_of_var):
    cursor.execute(query, list_of_var)


def get_scores():
    query = '''
    SELECT *
    FROM scores
    ORDER BY score DESC
    LIMIT 10'''
    list_of_var = []
    return db_mod_list_with_return(query=query, list_of_var=list_of_var)


def write_score(username, score):
    query = '''
    INSERT INTO scores
    VALUES (%s, %s)'''
    list_of_var = [username, int(score)]
    db_mod_list_without_return(query=query, list_of_var=list_of_var)
