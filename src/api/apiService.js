import { API_BASE_URL, ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from './config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  /**
   * Get dashboard count data
   */
  async getDashboardCount() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getDashboardCount called');
      const response = await this.get(ENDPOINTS.DASHBOARD_COUNT);
      const raw = response;
      const data = response?.data || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getDashboardCount error:', error);
      throw error;
    }
  }

  /**
   * Get current school settings
   */
  async getSchoolSettings() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getSchoolSettings called');
      const response = await this.get(ENDPOINTS.SCHOOL_SETTINGS_GET);

      // Normalize response similar to other methods
      const data = response?.data || response || null;
      const message = response?.message || null;
      return { raw: response, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getSchoolSettings error:', error);
      throw error;
    }
  }

  /**
   * Get academic years list
   */
  async getAcademicYears() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getAcademicYears called');
      const response = await this.get(ENDPOINTS.ACADEMIC_YEAR_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getAcademicYears error:', error);
      throw error;
    }
  }

  /**
   * Add a new academic year
   * @param {Object} payload { name, start_date, end_date, status }
   */
  async addAcademicYear(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addAcademicYear called', payload);
      // eslint-disable-next-line no-console
      console.log('[apiService] Token exists?', !!this.token, 'Token preview:', this.token ? this.token.substring(0, 20) + '...' : 'NO TOKEN');
      const response = await this.post(ENDPOINTS.ACADEMIC_YEAR_ADD, payload);
      
      // Check if API returned an error (status: false or status field indicates failure)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add academic year';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic year added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addAcademicYear error:', error);
      throw error;
    }
  }

  /**
   * Update an academic year
   * @param {number} id - The ID of the academic year to update
   * @param {Object} payload { name, start_date, end_date, status }
   */
  async updateAcademicYear(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateAcademicYear called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.ACADEMIC_YEAR_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update academic year';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic year updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateAcademicYear error:', error);
      throw error;
    }
  }

  /**
   * Delete an academic year
   * @param {number} id - The ID of the academic year to delete
   */
  async deleteAcademicYear(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteAcademicYear called with id:', id);
      const url = ENDPOINTS.ACADEMIC_YEAR_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete academic year';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic year deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteAcademicYear error:', error);
      throw error;
    }
  }

  /**
   * Get branches list
   */
  async getBranches() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getBranches called');
      const response = await this.get(ENDPOINTS.BRANCH_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getBranches error:', error);
      throw error;
    }
  }

  /**
   * Add a new branch
   * @param {Object} payload { name, address, status }
   */
  async addBranch(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addBranch called', payload);
      const response = await this.post(ENDPOINTS.BRANCH_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add branch';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Branch added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addBranch error:', error);
      throw error;
    }
  }

  /**
   * Update a branch
   * @param {number} id - The ID of the branch to update
   * @param {Object} payload { name, address, status }
   */
  async updateBranch(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateBranch called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.BRANCH_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update branch';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Branch updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateBranch error:', error);
      throw error;
    }
  }

  /**
   * Delete a branch
   * @param {number} id - The ID of the branch to delete
   */
  async deleteBranch(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteBranch called with id:', id);
      const url = ENDPOINTS.BRANCH_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete branch';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Branch deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteBranch error:', error);
      throw error;
    }
  }

  /**
   * Get pickup points list
   */
  async getPickupPoints() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getPickupPoints called');
      const response = await this.get(ENDPOINTS.PICKUP_POINT_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getPickupPoints error:', error);
      throw error;
    }
  }

  /**
   * Add a new pickup point
   * @param {Object} payload { name, longitude, latitude, status }
   */
  async addPickupPoint(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addPickupPoint called', payload);
      const response = await this.post(ENDPOINTS.PICKUP_POINT_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add pickup point';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Pickup point added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addPickupPoint error:', error);
      throw error;
    }
  }

  /**
   * Update a pickup point
   * @param {number} id - The ID of the pickup point to update
   * @param {Object} payload { name, longitude, latitude, status }
   */
  async updatePickupPoint(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updatePickupPoint called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.PICKUP_POINT_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update pickup point';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Pickup point updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updatePickupPoint error:', error);
      throw error;
    }
  }

  /**
   * Delete a pickup point
   * @param {number} id - The ID of the pickup point to delete
   */
  async deletePickupPoint(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deletePickupPoint called with id:', id);
      const url = ENDPOINTS.PICKUP_POINT_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete pickup point';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Pickup point deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deletePickupPoint error:', error);
      throw error;
    }
  }

  /**
   * Get grades list
   */
  async getGrades() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getGrades called');
      const response = await this.get(ENDPOINTS.GRADE_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getGrades error:', error);
      throw error;
    }
  }

  /**
   * Add a new grade
   * @param {Object} payload { name, branch_id, status }
   */
  async addGrade(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addGrade called', payload);
      const response = await this.post(ENDPOINTS.GRADE_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add grade';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Grade added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addGrade error:', error);
      throw error;
    }
  }

  /**
   * Update a grade
   * @param {number} id - The ID of the grade to update
   * @param {Object} payload { name, branch_id, status }
   */
  async updateGrade(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateGrade called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.GRADE_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update grade';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Grade updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateGrade error:', error);
      throw error;
    }
  }

  /**
   * Delete a grade
   * @param {number} id - The ID of the grade to delete
   */
  async deleteGrade(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteGrade called with id:', id);
      const url = ENDPOINTS.GRADE_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete grade';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Grade deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteGrade error:', error);
      throw error;
    }
  }

  /**
   * Get sections list
   */
  async getSections() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getSections called');
      const response = await this.get(ENDPOINTS.SECTION_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getSections error:', error);
      throw error;
    }
  }

  /**
   * Add a new section
   * @param {Object} payload { name, grade_id, status }
   */
  async addSection(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addSection called', payload);
      const response = await this.post(ENDPOINTS.SECTION_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add section';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Section added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addSection error:', error);
      throw error;
    }
  }

  /**
   * Update a section
   * @param {number} id - The ID of the section to update
   * @param {Object} payload { name, grade_id, status }
   */
  async updateSection(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSection called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.SECTION_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update section';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Section updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateSection error:', error);
      throw error;
    }
  }

  /**
   * Delete a section
   * @param {number} id - The ID of the section to delete
   */
  async deleteSection(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteSection called with id:', id);
      const url = ENDPOINTS.SECTION_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete section';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Section deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteSection error:', error);
      throw error;
    }
  }

  /**
   * Get RFID list
   */
  async getRfids() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getRfids called');
      const response = await this.get(ENDPOINTS.RFID_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getRfids error:', error);
      throw error;
    }
  }

  /**
   * Add a new RFID
   * @param {Object} payload { name, rfid_no, type, status }
   */
  async addRfid(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addRfid called', payload);
      const response = await this.post(ENDPOINTS.RFID_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add RFID';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'RFID added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addRfid error:', error);
      throw error;
    }
  }

  /**
   * Update an RFID
   * @param {number} id - The ID of the RFID to update
   * @param {Object} payload { name, rfid_no, type, status }
   */
  async updateRfid(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateRfid called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.RFID_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update RFID';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'RFID updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateRfid error:', error);
      throw error;
    }
  }

  /**
   * Delete an RFID
   * @param {number} id - The ID of the RFID to delete
   */
  async deleteRfid(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteRfid called with id:', id);
      const url = ENDPOINTS.RFID_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete RFID';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'RFID deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteRfid error:', error);
      throw error;
    }
  }

  /**
   * Get all vehicles
   */
  async getVehicles() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getVehicles called');
      const response = await this.get(ENDPOINTS.VEHICLE_GET);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to fetch vehicles';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Vehicles fetched';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getVehicles error:', error);
      throw error;
    }
  }

  /**
   * Add new vehicle
   */
  async addVehicle(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addVehicle called with payload:', payload);
      const response = await this.post(ENDPOINTS.VEHICLE_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add vehicle';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Vehicle added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addVehicle error:', error);
      throw error;
    }
  }

  /**
   * Update vehicle
   */
  async updateVehicle(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateVehicle called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.VEHICLE_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update vehicle';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Vehicle updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateVehicle error:', error);
      throw error;
    }
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteVehicle called with id:', id);
      const url = ENDPOINTS.VEHICLE_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete vehicle';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Vehicle deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteVehicle error:', error);
      throw error;
    }
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add auth token if available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
      });

      // Read raw text first so we can handle non-JSON responses (HTML error pages, etc.)
      const rawText = await response.text();
      let responseData = null;
      try {
        responseData = rawText ? JSON.parse(rawText) : null;
      } catch (parseErr) {
        // Not JSON — keep rawText available for debugging
        responseData = null;
        // eslint-disable-next-line no-console
        console.warn('[apiService] Non-JSON response received for', url, 'status', response.status);
        // eslint-disable-next-line no-console
        console.warn('[apiService] Raw response text:', rawText ? rawText.substring(0, 1000) : '<empty>');
      }

      if (!response.ok) {
        // Try to extract a message from parsed JSON, otherwise use raw text or a generic message
        const message = (responseData && (responseData.message || responseData.error)) || (rawText ? rawText : ERROR_MESSAGES.UNKNOWN_ERROR);
        throw {
          status: response.status,
          message,
          data: responseData || rawText,
        };
      }

      return responseData;
    } catch (error) {
      // Map native fetch/network errors (TypeError) to a clear network message.
      // Our code above throws plain objects for HTTP errors (status, message, data),
      // so only transform real Error instances that look like network failures.
      if (error instanceof Error && (error.name === 'TypeError' || (error.message && error.message.includes('Network')))) {
        throw {
          status: 0,
          message: ERROR_MESSAGES.NETWORK_ERROR,
          error,
        };
      }
      // Otherwise rethrow the original error object (may contain status, data, raw HTML, etc.)
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await this.post(ENDPOINTS.LOGIN, { email, password });

      // Normalize and extract token from common response shapes
      const token = response?.token || response?.access_token || response?.data?.token || response?.auth?.token || null;
      const user = response?.user || response?.data?.user || response?.data || null;

      if (token) {
        this.setToken(token);
      }

      // Return a consistent shape
      return { raw: response, token, user };
    } catch (error) {
      // Log login error for debugging and rethrow
      // eslint-disable-next-line no-console
      console.error('[apiService] login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.post(ENDPOINTS.LOGOUT);
      this.clearToken();
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  /**
   * Register user
   */
  async register(userData) {
    try {
      const response = await this.post(ENDPOINTS.REGISTER, userData);
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      return await this.get(ENDPOINTS.PROFILE);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Auth check - returns detailed user info including role, student/teacher data and permissions
   */
  async authCheck() {
    try {
      const response = await this.get(ENDPOINTS.AUTH_CHECK);

      // The backend may wrap data differently. Try to normalize:
      // Common shapes: { success: true, data: { ... } } or direct { user_id, name, role, ... }
      const data = response?.data || response || {};

      // If wrapper has success flag and empty data when unauthenticated, handle that upstream
      const userInfo = data;

      // response may contain token inside data.token as per RoleHelper
      const token = data?.token || response?.token || null;

      return { raw: response, user: userInfo, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Subscribe FCM token for push notifications
   * @param {string} fcmToken
   */
  async subscribe(fcmToken) {
    try {
      if (!fcmToken) throw { message: 'FCM token is required' };
      const response = await this.post(ENDPOINTS.SUBSCRIBE, { fcm_token: fcmToken });
      // backend returns res(true, [], ['message']) or similar. Normalize message
      const message = response?.message || (response?.meta && response.meta.message) || (Array.isArray(response?.errors) ? response.errors[0] : null) || null;
      return { raw: response, message };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) throw { message: 'Both current and new passwords are required' };
      // DO NOT log passwords themselves. Log call info for debugging.
      // eslint-disable-next-line no-console
      console.log('[apiService] changePassword called for endpoint', ENDPOINTS.CHANGE_PASSWORD);

      const response = await this.post(ENDPOINTS.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword,
      });

      // Log response for debugging (avoid sensitive fields)
      // eslint-disable-next-line no-console
      console.log('[apiService] changePassword response:', response);

      // Normalize message
      const message = response?.message || (response?.meta && response.meta.message) || (Array.isArray(response?.errors) ? response.errors[0] : null) || 'Password changed';
      return { raw: response, message };
    } catch (error) {
      // Log error for debugging
      // eslint-disable-next-line no-console
      console.error('[apiService] changePassword error:', error);
      throw error;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken() {
    try {
      const response = await this.post(ENDPOINTS.REFRESH_TOKEN);
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  /**
   * Get or update school settings
   */
  async updateSchoolSettings(settingsData) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchoolSettings called');

      const url = `${this.baseURL}${ENDPOINTS.SCHOOL_SETTINGS}`;
      
      const headers = {};

      // Add auth token if available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      // Determine if this is FormData (for file uploads) or JSON
      const isFormData = settingsData instanceof FormData;
      
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      // If FormData, don't set Content-Type - fetch will set it automatically with boundary

      // Log the request details
      // eslint-disable-next-line no-console
      console.log('[apiService] Sending request to:', url);
      // eslint-disable-next-line no-console
      console.log('[apiService] Headers:', headers);
      
      if (isFormData) {
        // eslint-disable-next-line no-console
        console.log('[apiService] Data: FormData (multipart) - file upload');
      } else {
        // eslint-disable-next-line no-console
        console.log('[apiService] Data:', JSON.stringify(settingsData));
      }

      const fetchOptions = {
        method: 'POST',
        headers,
        body: isFormData ? settingsData : JSON.stringify(settingsData),
      };

      const response = await fetch(url, fetchOptions);

      // Read raw text first
      const rawText = await response.text();
      let responseData = null;
      try {
        responseData = rawText ? JSON.parse(rawText) : null;
      } catch (parseErr) {
        // eslint-disable-next-line no-console
        console.warn('[apiService] Non-JSON response:', rawText ? rawText.substring(0, 500) : '<empty>');
      }

      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchoolSettings response status:', response.status);
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchoolSettings response:', responseData || rawText);

      if (!response.ok) {
        const message = (responseData && (responseData.message || responseData.error)) || 
                       (rawText ? rawText : 'Failed to update school settings');
        throw {
          status: response.status,
          message,
          data: responseData || rawText,
        };
      }

      // Normalize response
      const data = responseData?.data || responseData;
      const message = responseData?.message || 'School settings updated successfully';
      
      return { raw: responseData, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateSchoolSettings error:', error);
      throw error;
    }
  }
}

export default new ApiService();
