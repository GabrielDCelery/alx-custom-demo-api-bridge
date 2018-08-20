'use strict';

class RecordNormalizer {
    normalizeCandidate (_alxId, _email, _firstName, _lastName) {
        return {
            alxId: _alxId,
            email: _email,
            firstName: _firstName,
            lastName: _lastName
        };
    }

    normalizeVacancy (_alxId, _vacancyId, _branchName, _jobTitle) {
        return {
            alxId: _alxId,
            vacancyId: _vacancyId,
            branchName: _branchName,
            jobTitle: _jobTitle
        };
    }

    normalizeCandidateVacancy (_alxId, _candidateEmail, _vacancyId, _status, _createdAt) {
        return {
            alxId: _alxId,
            candidateEmail: _candidateEmail,
            vacancyId: _vacancyId,
            status: _status,
            createdAt: _createdAt
        };
    }
}

module.exports = new RecordNormalizer();