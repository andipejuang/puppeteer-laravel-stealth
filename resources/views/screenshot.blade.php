<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puppeteer Stealth Screenshot</title>
</head>
<body>
<h1>Take Website Screenshot Using Puppeteer Stealth</h1>

<form action="/capture-screenshot" method="POST">
    @csrf
    <label for="url">Website URL:</label>
    <input type="url" id="url" name="url" required>
    <button type="submit">Capture Screenshot</button>
</form>
</body>
</html>
