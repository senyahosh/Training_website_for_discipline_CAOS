const WebSocket = require('ws');
const { exec } = require('child_process');
const fs = require('fs');
const wss = new WebSocket.Server({ port: 8080 });

function copyFile(source, target) {
  fs.copyFile(source, target, (err) => {
    if (err) throw err;
    console.log('Dockerfile скопирован в папку uploads');
  });
}

const sourcePath = 'C:/Users/111/MySite/gccImage/Dockerfile';
const targetPath = 'C:/Users/111/MySite/uploads/Dockerfile';
copyFile(sourcePath, targetPath);

async function runTests(testFiles) {
  let countOfPassedTests = 0;
  var i = 0; 
  const promises = testFiles.map(async (testFile) => {
    let test_command = `docker run -i c-compiler < ${testFile}`;
    let childProcess = await exec(`${test_command}`);

    let outputBuffer = '';

    await new Promise((resolve, reject) => {
      childProcess.stdout.on('data', (data) => {
        outputBuffer += data.toString();
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Произошла ошибка при выполнении команды. Код ошибки: ${code}`);
          reject(new Error(`Ошибка при выполнении теста ${testFile}`));
        } else {
          const test_output = outputBuffer.trim().replace(/\s+/g,' ');
          const expectedOutput = fs.readFileSync(testFile.replace('.txt', '_output.txt'), 'utf8').trim().replace(/\s+/g,' ');

          if (test_output === expectedOutput) {
            countOfPassedTests += 1;
          } 

          resolve();
        }
      });
    }); 
  });

  await Promise.all(promises);
  return countOfPassedTests;

}

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    async function showCheckResult(countOfTests, testFiles, outputFile, output1, output2) {
      const outputOfTests = await runTests(testFiles);
      let editedOutput;
      if (outputOfTests == 1) {
        editedOutput = "Отчет компилятора:\n" + output1 + "\nОтчет Cppcheck:\n" + output2 + `\nПройден ${outputOfTests} тест из ${countOfTests}.`;
      } else if (outputOfTests > 1 && outputOfTests < 5) {
        editedOutput = "Отчет компилятора:\n" + output1 + "\nОтчет Cppcheck:\n" + output2 + `\nПройдено ${outputOfTests} теста из ${countOfTests}.`;
      } else { 
        editedOutput = "Отчет компилятора:\n" + output1 + "\nОтчет Cppcheck:\n" + output2 + `\nПройдено ${outputOfTests} тестов из ${countOfTests}.`;
      }

      fs.writeFileSync(outputFile, editedOutput);
      ws.send(editedOutput);
    }

    const receivedData = JSON.parse(data);
    const commands = receivedData.commands;
    const testFiles = receivedData.testFiles;
    const countOfTests = testFiles.length;
    const outputFile = 'output.txt';
    const fullOutputFile = 'fullOutput.txt'

    exec(`${commands[0]} || ${commands[1]}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка выполнения команд: ${error}`);
        ws.send(`Произошла ошибка при выполнении команд.`);
        return;
      }

      const output = `${stdout}\n${stderr}`;
      let output1 = "Компилятор отработал без ошибок.\n";
      let output2 = "Cppcheck не выявил ошибок.\n";

      fs.writeFileSync(fullOutputFile, output);

      if (output.lastIndexOf("/code") != -1) {

        output2 = output.substring(output.lastIndexOf("/code"));
      
      }

      if (output.indexOf("------\n >") != -1 && output.indexOf("------\nDockerfile") != -1 && output.indexOf("ERROR") != -1) {

        let charToRemove = "#8 ";
        let regex = new RegExp(charToRemove, 'g');
        output1 = output.substring(output.indexOf(" RUN gcc -o ")+1, output.indexOf("------\n >"));
        output1 = output1.replace(regex, '');

        let editedOutput = "Отчет компилятора:\n" + output1 + "\nОтчет Cppcheck:\n" + output2 + `\nПроверка программы на тестах не запущена из-за возникшей ошибки компиляции.\n`;
        fs.writeFileSync(outputFile, editedOutput);
        ws.send(editedOutput);
      
      } else {

        showCheckResult(countOfTests, testFiles, outputFile, output1, output2);
        
      }
    });
  });
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/111/MySite/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Main.html'));
});

app.get('/Main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Main.html'));
});

// Ссылки на основные страницы
app.get('/Lectures.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lectures.html'));
});

app.get('/Labs.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Labs.html'));
});

app.get('/Tests.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Tests.html'));
});

app.get('/Indivs.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Indivs.html'));
});

app.get('/Other.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Other.html'));
});

app.get('/Profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Profile.html'));
});

app.get('/Registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Registration.html'));
});

app.get('/Authorization.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Authorization.html'));
});

// Ссылки на подстраницы
app.get('/labs/lab1.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'labs/lab1.html'));
});

app.get('/labs/lab11.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'labs/lab11.html'));
});

app.get('/labs/lab10.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'labs/lab10.html'));
});

app.get('/labs/lab11_prep.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'labs/lab11_prep.html'));
});

app.get('/indivs/indiv4.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/indivs/indiv4.html'));
});

app.get('/tests/test10.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/tests/test10.html'));
});

app.get('/info/literatures.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/info/literatures.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully!');
});

app.listen(8000, () => {
    console.log('Сервер сайта запущен на http://localhost:8000');
});

console.log('Сервер проверки кода запущен на порту 8080');
