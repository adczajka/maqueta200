# SPB Notifier

SPB Notifier is a web application designed to facilitate the request of agents for duty based on their availability and abilities. The application intelligently selects agents from a mock database while ensuring that previously requested agents are skipped.

## Project Structure

```
spb-notifier
├── src
│   ├── index.html          # HTML structure for the web application
│   ├── styles
│   │   └── main.css       # Styles for the web application
│   ├── scripts
│   │   ├── app.js         # Main JavaScript entry point
│   │   ├── agentSelector.js # Logic for selecting agents based on status and ability
│   │   ├── requestTracker.js # Class for tracking agent requests
│   │   └── mockDatabase.js # Simulates fetching agent data from a mock database
│   └── types
│       └── index.d.ts     # TypeScript type definitions
├── data
│   └── agents.json        # Mock data for agents
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Features

- **Agent Selection**: Automatically selects agents based on their current status (available, on vacation, sick leave) and abilities.
- **Request Tracking**: Records requests to ensure previously requested agents are skipped in future requests.
- **Responsive Design**: The application is designed to be user-friendly and responsive across different devices.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd spb-notifier
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Open `index.html` in a web browser to view the application.

## Usage

- Fill out the form to request an agent.
- The application will automatically select an available agent based on the criteria defined in the mock database.
- Requests are tracked to avoid selecting the same agent multiple times.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.