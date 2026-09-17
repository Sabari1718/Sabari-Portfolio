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
            await database_1.default.query("ALTER TABLE profile ADD COLUMN years_experience VARCHAR(50) DEFAULT '1+'");
        }
        if (!existing.has('projects_count')) {
            await database_1.default.query("ALTER TABLE profile ADD COLUMN projects_count VARCHAR(50) DEFAULT '10+'");
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
        const profile = { ...profiles[0] };
        // Synchronize embedded bio stats if available
        if (profile.bio && typeof profile.bio === 'string' && profile.bio.includes('<!--STATS:')) {
            try {
                const match = profile.bio.match(/<!--STATS:([\s\S]*?)-->/);
                if (match && match[1]) {
                    const parsed = JSON.parse(match[1]);
                    if (parsed.years_experience)
                        profile.years_experience = parsed.years_experience;
                    if (parsed.projects_count)
                        profile.projects_count = parsed.projects_count;
                    if (parsed.technologies_count)
                        profile.technologies_count = parsed.technologies_count;
                    if (parsed.repos_count)
                        profile.repos_count = parsed.repos_count;
                    if (parsed.badge_text)
                        profile.badge_text = parsed.badge_text;
                    if (parsed.greeting_text)
                        profile.greeting_text = parsed.greeting_text;
                }
            }
            catch (err) {
                // ignore JSON parse error
            }
        }
        res.status(200).json({ success: true, data: profile });
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
        let safeYearsExp = years_experience !== undefined && years_experience !== null && String(years_experience).trim() !== "" ? String(years_experience).trim() : null;
        let safeProjectsCnt = projects_count !== undefined && projects_count !== null && String(projects_count).trim() !== "" ? String(projects_count).trim() : null;
        let safeTechCnt = technologies_count !== undefined && technologies_count !== null && String(technologies_count).trim() !== "" ? String(technologies_count).trim() : null;
        let safeReposCnt = repos_count !== undefined && repos_count !== null && String(repos_count).trim() !== "" ? String(repos_count).trim() : null;
        // If bio has embedded stats, sync from there if not directly provided
        if (safeBio && safeBio.includes('<!--STATS:')) {
            try {
                const match = safeBio.match(/<!--STATS:([\s\S]*?)-->/);
                if (match && match[1]) {
                    const parsed = JSON.parse(match[1]);
                    if (!safeYearsExp && parsed.years_experience)
                        safeYearsExp = String(parsed.years_experience).trim();
                    if (!safeProjectsCnt && parsed.projects_count)
                        safeProjectsCnt = String(parsed.projects_count).trim();
                    if (!safeTechCnt && parsed.technologies_count)
                        safeTechCnt = String(parsed.technologies_count).trim();
                    if (!safeReposCnt && parsed.repos_count)
                        safeReposCnt = String(parsed.repos_count).trim();
                }
            }
            catch (err) { }
        }
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
                safeYearsExp || '1+', safeProjectsCnt || '10+', safeTechCnt || '15+', safeReposCnt || '10+'
            ]);
            res.status(201).json({ success: true, message: 'Profile created successfully' });
        }
        else {
            // Update existing profile (preserve existing profile_image/stats if not provided)
            const currentProfile = profiles[0];
            const finalProfileImage = profile_image !== undefined ? safeProfileImage : currentProfile.profile_image;
            const finalYearsExp = safeYearsExp !== null ? safeYearsExp : (currentProfile.years_experience ?? '1+');
            const finalProjectsCnt = safeProjectsCnt !== null ? safeProjectsCnt : (currentProfile.projects_count ?? '10+');
            const finalTechCnt = safeTechCnt !== null ? safeTechCnt : (currentProfile.technologies_count ?? '15+');
            const finalReposCnt = safeReposCnt !== null ? safeReposCnt : (currentProfile.repos_count ?? '10+');
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