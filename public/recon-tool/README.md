# Vehicle Reconditioning Tool

This demo web app lets you track vehicles through multi-stage reconditioning entirely in the browser. Data is stored in `localStorage` so it persists across page reloads without a backend.

## Features
- VIN lookup via the NHTSA API
- Track stage progression: Arrival → Inspection → Mechanical → Detail → Photos → Online
- Record labor and parts costs; total cost updates automatically
- Manage a list of parts per vehicle with status tracking
- Data saved to browser storage; a **Reset Data** button clears it

## Usage
Open `index.html` in any modern browser. Enter a VIN to add a new vehicle or select an existing one from the list. Update the stage and costs as work progresses. Parts can be added, updated, or removed. All changes are stored locally.

This implementation is provided as a static example and is not connected to a backend server.
