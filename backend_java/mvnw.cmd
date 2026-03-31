@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script, version 0.5.6
@REM ----------------------------------------------------------------------------
@echo off
setlocal EnableExtensions EnableDelayedExpansion

set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

set WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper
set WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar
set WRAPPER_PROPERTIES=%WRAPPER_DIR%\maven-wrapper.properties

if not exist "%WRAPPER_JAR%" (
  if not exist "%WRAPPER_DIR%" (
    mkdir "%WRAPPER_DIR%" 1>nul 2>nul
  )
  set "WRAPPER_URL="
  for /f "usebackq tokens=1,2 delims==" %%A in ("%WRAPPER_PROPERTIES%") do (
    if "%%A"=="wrapperUrl" set "WRAPPER_URL=%%B"
  )
  if not defined WRAPPER_URL set "WRAPPER_URL=https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue';Invoke-WebRequest -UseBasicParsing -Uri '!WRAPPER_URL!' -OutFile '!WRAPPER_JAR!';"
  if not exist "!WRAPPER_JAR!" (
    echo Failed to download Maven Wrapper JAR from !WRAPPER_URL!
    exit /b 1
  )
)

set JAVA_EXE=java.exe
if defined JAVA_HOME set JAVA_EXE=%JAVA_HOME%\bin\java.exe

"%JAVA_EXE%" -classpath "%WRAPPER_JAR%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
