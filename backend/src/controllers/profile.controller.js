"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const database_1 = __importDefault(require("../config/database"));
let columnsChecked = false;
async function ensureStatsColumns() {
    if (columnsChecked)
        return;
    try {
        const [cols] = await database_1.default.query('SHOW COLUMNS FROM profile');
        const existing = new Set(cols.map((c) => c.Field));
        if (!existing.has('years_experience')) {
            await database_1.default.query("ALTER TABLE profile ADD COLUMN years_experience VARCHAR(50) DEFAULT '2+'");
        }
        if (!existing.has('projects_count')) {
            await database_1.default.query("ALTER TABLE profile ADD COLUMN projects_count VARCHAR(50) DEFAULT '1+'");
        }
        if (!existing.has('technologies_count')) {
            await database_1.default.query("ALTER TABLE profile ADD COLUMN technologies_count VARCHAR(50) DEFAULT '15+'");
        }
        if (!existing.has('repos_count')) {
            await database_1.default.query("ALTER TABLE profile ADD COLUMN repos_count VARCHAR(50) DEFAULT '10+'");
        }
        columnsChecked = true;
    }
    catch (err) {
        console.error('Column ensure check error:', err);
    }
}
// @desc    Get portfolio profile
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
    try {
        await ensureStatsColumns();
        const [rows] = await database_1.default.query('SELECT * FROM profile LIMIT 1');
        const profiles = rows;
        if (profiles.length === 0) {
            res.status(404).json({ success: false, message: 'Profile not found' });
            return;
        }
        res.status(200).json({ success: true, data: profiles[0] });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching profile' });
    }
};
exports.getProfile = getProfile;
// @desc    Create or Update portfolio profile
// @route   PUT /api/profile
// @access  Private (Admin)
const updateProfile = async (req, res) => {
    try {
        await ensureStatsColumns();
        const { name, display_name, headline, bio, profile_image, location, email, phone, resume_url, github_url, linkedin_url, portfolio_url, twitter_url, years_experience, projects_count, technologies_count, repos_count } = req.body;
        // Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Name is required' });
            return;
        }
        // Sanitize — trim strings, convert undefined/null consistently
        const safeName = name.trim();
        const safeDisplayName = display_name?.trim() ?? null;
        const safeHeadline = headline?.trim() ?? null;
        const safeBio = bio?.trim() ?? null;
        const safeProfileImage = profile_image?.trim() ?? null;
        const safeLocation = location?.trim() ?? null;
        const safeEmail = email?.trim() ?? null;
        const safePhone = phone?.trim() ?? null;
        const safeResumeUrl = resume_url?.trim() ?? null;
        const safeGithubUrl = github_url?.trim() ?? null;
        const safeLinkedinUrl = linkedin_url?.trim() ?? null;
        const safePortfolioUrl = portfolio_url?.trim() ?? null;
        const safeTwitterUrl = twitter_url?.trim() ?? null;
        const safeYearsExp = years_experience !== undefined ? (years_experience ? String(years_experience).trim() : null) : null;
        const safeProjectsCnt = projects_count !== undefined ? (projects_count ? String(projects_count).trim() : null) : null;
        const safeTechCnt = technologies_count !== undefined ? (technologies_count ? String(technologies_count).trim() : null) : null;
        const safeReposCnt = repos_count !== undefined ? (repos_count ? String(repos_count).trim() : null) : null;
        // Check if profile exists
        const [existingProfile] = await database_1.default.query('SELECT * FROM profile LIMIT 1');
        const profiles = existingProfile;
        if (profiles.length === 0) {
            // Create new profile
            const query = `
        INSERT INTO profile 
          (name, display_name, headline, bio, profile_image, location, email, phone, resume_url, github_url, linkedin_url, portfolio_url, twitter_url, years_experience, projects_count, technologies_count, repos_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            await database_1.default.query(query, [
                safeName, safeDisplayName, safeHeadline, safeBio, safeProfileImage,
                safeLocation, safeEmail, safePhone, safeResumeUrl,
                safeGithubUrl, safeLinkedinUrl, safePortfolioUrl, safeTwitterUrl,
                safeYearsExp || '2+', safeProjectsCnt || '1+', safeTechCnt || '15+', safeReposCnt || '10+'
            ]);
            res.status(201).json({ success: true, message: 'Profile created successfully' });
        }
        else {
            // Update existing profile (preserve existing profile_image/stats if not provided)
            const currentProfile = profiles[0];
            const finalProfileImage = profile_image !== undefined ? safeProfileImage : currentProfile.profile_image;
            const finalYearsExp = years_experience !== undefined ? safeYearsExp : (currentProfile.years_experience ?? '2+');
            const finalProjectsCnt = projects_count !== undefined ? safeProjectsCnt : (currentProfile.projects_count ?? '1+');
            const finalTechCnt = technologies_count !== undefined ? safeTechCnt : (currentProfile.technologies_count ?? '15+');
            const finalReposCnt = repos_count !== undefined ? safeReposCnt : (currentProfile.repos_count ?? '10+');
            const query = `
        UPDATE profile 
        SET name = ?, display_name = ?, headline = ?, bio = ?, profile_image = ?,
            location = ?, email = ?, phone = ?, resume_url = ?,
            github_url = ?, linkedin_url = ?, portfolio_url = ?, twitter_url = ?,
            years_experience = ?, projects_count = ?, technologies_count = ?, repos_count = ?
        WHERE id = ?
      `;
            await database_1.default.query(query, [
                safeName, safeDisplayName, safeHeadline, safeBio, finalProfileImage,
                safeLocation, safeEmail, safePhone, safeResumeUrl,
                safeGithubUrl, safeLinkedinUrl, safePortfolioUrl, safeTwitterUrl,
                finalYearsExp, finalProjectsCnt, finalTechCnt, finalReposCnt,
                currentProfile.id
            ]);
            res.status(200).json({ success: true, message: 'Profile updated successfully' });
        }
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server Error updating profile' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=profile.controller.js.map