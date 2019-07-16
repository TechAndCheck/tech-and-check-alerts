# Log Levels

Taken from [this StackOverflow answer](https://stackoverflow.com/questions/4874128/what-information-to-include-at-each-log-level):

- **Trace:** The finest logging level. Can be used to log very specific information that is only relevant in a true debugging scenario. E.g., log every database access or every HTTP call.
- **Debug:** Information to primary help you to debug your program. E.g., log every time a batching routine empties its batch or a new file is created on disk.
- **Info:** General application flow, such as "Starting app", "Connecting to db", "Registering...". In short, information which should help any observer understand what the application is doing in general.
- **Warn:** Warns of errors that can be recovered, such as failing to parse a date or using an unsafe routine. Note though that we should still try to obey the fail fast principle; e.g., don't hide configuration errors using a warning message, even though a default value might be provided by the application.
- **Error:** Denotes an unrecoverable error, such as failing to open a database connection.
- **Fatal/Critical:** Used to log an error the application cannot recover from, which might lead to an immediate program termination.
