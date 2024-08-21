# Task 2

Bu ödevde göreviniz, tüm tiplerle alakalı oluşturma, güncelleme, silme ve tümünü silme Mutation'larını hazırlamak olacak.


## Gereksinimler

- Yeni bir User ekleyecek Mutation yazılmalıdır.
- Bir User'ı güncelleyecek olan Mutation yazılmalıdır.
- Bir User'ı silecek olan Mutation yazılmalıdır.
- Tüm User'ları silecek olan Mutation yazılmalıdır.
- Yukarıdaki maddeler Event, Location ve Participant için de uygulanmalıdır.


Günün sonunda aşağıdaki Query'ler çalışır vaziyette olmalıdır.

```
  mutation addUser   mutation updateUser
  mutation deleteUser
  mutation deleteAllUsers

  mutation addEvent   mutation updateEvent
  mutation deleteEvent
  mutation deleteAllEvents

  mutation addLocation   mutation updateLocation
  mutation deleteLocation
  mutation deleteAllLocations

  mutation addParticipant   mutation updateParticipant
  mutation deleteParticipant
  mutation deleteAllParticipants

  query events{}
  query event(id: 1){}
  query events{
    id
    title
    user{
      id
      username
    }
    pariticipants{
      id
      username
    }
    location{
      id
      name
    }
  }

  query locations{}
  query location(id: 1){}

  query participants{}
  query participant(id: 1){}
```
