from persistence.db import get_connection
from datetime import datetime

class Winner:

    def __init__(self, id, name, email, phrase, attempts=0, date_created=None):
        self.id = id
        self.name = name
        self.email = email
        self.phrase = phrase
        # Nuevo campo para almacenar el número de intentos
        self.attempts = attempts
        # Nuevo campo para la fecha y hora del triunfo
        self.date_created = date_created
        
    def save(self):
        """Guarda un nuevo ganador incluyendo intentos y fecha actual."""
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Se añaden las columnas attempts y date_created a la consulta
            query = """
                INSERT INTO winners (name, email, phrase, attempts, date_created) 
                VALUES (%s, %s, %s, %s, %s)
            """
            # Se obtiene el momento exacto en el que ganó
            now = datetime.now()
            
            cursor.execute(query, (self.name, self.email, self.phrase, self.attempts, now))
            connection.commit()
            self.id = cursor.lastrowid
            return self.id
        except Exception as ex: 
            print("Error al guardar registro: ", ex)
            return 0
        finally:
            cursor.close()
            connection.close()
            
    @classmethod
    def delete(cls, winner_id):
        """Elimina un registro de ganador por su ID."""
        try:
            connection = get_connection()
            cursor = connection.cursor()
            query = "DELETE FROM winners WHERE id = %s"
            cursor.execute(query, (winner_id,))
            connection.commit()
            # Retorna True si se eliminó algún registro
            return cursor.rowcount > 0
        except Exception as ex:
            print("Error al eliminar registro: ", ex)
            return False
        finally:
            cursor.close()
            connection.close()
        
    @classmethod    
    def get_all(cls): 
        """Obtiene todos los ganadores ordenados por intentos (ASC) y fecha (DESC)."""
        winners = []
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # 1. Ordenado por intentos de menor a mayor
            # 2. Ordenado por fecha de la más reciente a la más vieja
            query = """
                SELECT id, name, email, phrase, attempts, date_created 
                FROM winners 
                ORDER BY attempts ASC, date_created DESC
            """
            cursor.execute(query)
            rows = cursor.fetchall()
            
            for row in rows:
                # Se mapean los nuevos campos a la instancia de la clase
                winner = cls(
                    id=row[0], 
                    name=row[1], 
                    email=row[2], 
                    phrase=row[3], 
                    attempts=row[4], 
                    date_created=row[5]
                )
                winners.append(winner)
                
            return winners
        except Exception as ex: 
            print("Error al obtener registros: ", ex)
            return []
        finally:
            cursor.close()
            connection.close()