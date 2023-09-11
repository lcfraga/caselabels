FROM jenkins/jenkins:2.414.1-lts-jdk11

ENV JENKINS_USER admin
ENV JENKINS_PASS admin

# Skip initial setup
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

# Update packages; plugin installation requires updated certificates
USER root
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

RUN curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | apt-key add -

RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable"

RUN apt-get update && apt-get -y install docker-ce

RUN usermod -aG docker jenkins

RUN apt-get clean

# Install docker-compose
RUN curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s | awk '{print tolower($0)}')-$(uname -m)" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose

# Install plugins
USER jenkins
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt

# Install CI job
COPY caselabels-backend-job.xml /usr/share/jenkins/ref/jobs/caselabels-backend/config.xml

USER root
# Install gosu for a better su+exec command
ARG GOSU_VERSION=1.10
RUN dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')" \
  && curl -L "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch" -o /usr/local/bin/gosu \
  && chmod +x /usr/local/bin/gosu \
  && gosu nobody true

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
HEALTHCHECK CMD curl -sSLf http://localhost:8080/login >/dev/null || exit 1
