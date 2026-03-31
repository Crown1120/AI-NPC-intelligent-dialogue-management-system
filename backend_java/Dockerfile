# 使用 JDK 17 运行环境
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 将编译好的 jar 包复制到容器中
# 假设你在本地运行 mvn clean package 后生成了 jar
COPY target/*.jar app.jar

# 暴露 8080 端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]
