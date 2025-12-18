import { API_BASE_URL, ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from './config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
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
   * Get all events
   */
  async getEvents() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getEvents called');
      const response = await this.get(ENDPOINTS.EVENT_GET);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to fetch events';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Events fetched';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getEvents error:', error);
      throw error;
    }
  }

  /**
   * Add new event with FormData for image upload
   */
  async addEvent(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addEvent called with payload:', payload);
      const response = await this.post(ENDPOINTS.EVENT_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to add event';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Event added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addEvent error:', error);
      throw error;
    }
  }

  /**
   * Update event with FormData for image upload
   */
  async updateEvent(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateEvent called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.EVENT_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to update event';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Event updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateEvent error:', error);
      throw error;
    }
  }

  /**
   * Delete event
   */
  async deleteEvent(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteEvent called with id:', id);
      const url = ENDPOINTS.EVENT_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to delete event';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Event deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteEvent error:', error);
      throw error;
    }
  }

  /**
   * Get all academic calendars
   */
  async getAcademicCalendars(year = null, month = null) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getAcademicCalendars called with year:', year, 'month:', month);
      
      const payload = {};
      if (year) payload.year = year;
      if (month) payload.month = month;
      
      const response = await this.get(ENDPOINTS.ACADEMIC_CALENDAR_GET, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? Object.values(response.msg).flat().join(', ') : 'Failed to fetch academic calendars';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic calendars fetched';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getAcademicCalendars error:', error);
      throw error;
    }
  }

  /**
   * Add academic calendar
   */
  async addAcademicCalendar(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addAcademicCalendar called with payload:', payload);
      const response = await this.post(ENDPOINTS.ACADEMIC_CALENDAR_ADD, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to add academic calendar';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic calendar added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addAcademicCalendar error:', error);
      throw error;
    }
  }

  /**
   * Update academic calendar
   */
  async updateAcademicCalendar(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateAcademicCalendar called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.ACADEMIC_CALENDAR_UPDATE.replace('{id}', id);
      const response = await this.post(url, payload);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to update academic calendar';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic calendar updated';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateAcademicCalendar error:', error);
      throw error;
    }
  }

  /**
   * Delete academic calendar
   */
  async deleteAcademicCalendar(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteAcademicCalendar called with id:', id);
      const url = ENDPOINTS.ACADEMIC_CALENDAR_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      // Check if API returned an error (status: false)
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to delete academic calendar';
        throw {
          status: 400,
          message: errorMsg,
          data: response,
        };
      }
      
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic calendar deleted';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteAcademicCalendar error:', error);
      throw error;
    }
  }

  /**
   * Get castes
   */
  async getCastes() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getCastes called');
      const response = await this.get(ENDPOINTS.CASTE_GET);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to fetch castes';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      const data = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
      return { raw: response, data, message: 'Castes fetched' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getCastes error:', error);
      throw error;
    }
  }

  /**
   * Add caste
   */
  async addCaste(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addCaste called with payload:', payload);
      const response = await this.post(ENDPOINTS.CASTE_ADD, payload);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to add caste';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Caste added' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addCaste error:', error);
      throw error;
    }
  }

  /**
   * Update caste
   */
  async updateCaste(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateCaste called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.CASTE_UPDATE.replace('{id}', id);
      const response = await this.post(url, { ...payload, _method: 'POST' });
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to update caste';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Caste updated' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateCaste error:', error);
      throw error;
    }
  }

  /**
   * Delete caste
   */
  async deleteCaste(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteCaste called with id:', id);
      const url = ENDPOINTS.CASTE_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to delete caste';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Caste deleted' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteCaste error:', error);
      throw error;
    }
  }

  /**
   * Get religions
   */
  async getReligions() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getReligions called');
      const response = await this.get(ENDPOINTS.RELIGION_GET);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to fetch religions';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      const data = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
      return { raw: response, data, message: 'Religions fetched' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getReligions error:', error);
      throw error;
    }
  }

  /**
   * Add religion
   */
  async addReligion(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addReligion called with payload:', payload);
      const response = await this.post(ENDPOINTS.RELIGION_ADD, payload);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to add religion';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Religion added' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addReligion error:', error);
      throw error;
    }
  }

  /**
   * Update religion
   */
  async updateReligion(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateReligion called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.RELIGION_UPDATE.replace('{id}', id);
      const response = await this.post(url, { ...payload, _method: 'POST' });
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to update religion';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Religion updated' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateReligion error:', error);
      throw error;
    }
  }

  /**
   * Delete religion
   */
  async deleteReligion(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteReligion called with id:', id);
      const url = ENDPOINTS.RELIGION_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to delete religion';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Religion deleted' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteReligion error:', error);
      throw error;
    }
  }

  /**
   * Get routes
   */
  async getRoutes() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getRoutes called');
      const response = await this.get(ENDPOINTS.ROUTE_GET);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to fetch routes';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      const data = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
      return { raw: response, data, message: 'Routes fetched' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getRoutes error:', error);
      throw error;
    }
  }

  /**
   * Add route
   */
  async addRoute(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addRoute called with payload:', payload);
      const response = await this.post(ENDPOINTS.ROUTE_ADD, payload);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to add route';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Route added' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addRoute error:', error);
      throw error;
    }
  }

  /**
   * Update route
   */
  async updateRoute(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateRoute called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.ROUTE_UPDATE.replace('{id}', id);
      const response = await this.post(url, { ...payload, _method: 'POST' });
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to update route';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Route updated' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateRoute error:', error);
      throw error;
    }
  }

  /**
   * Delete route
   */
  async deleteRoute(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteRoute called with id:', id);
      const url = ENDPOINTS.ROUTE_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to delete route';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Route deleted' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteRoute error:', error);
      throw error;
    }
  }

  /**
   * Get scholarships
   */
  async getScholarships() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getScholarships called');
      const response = await this.get(ENDPOINTS.SCHOLARSHIP_GET);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to fetch scholarships';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      const data = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
      return { raw: response, data, message: 'Scholarships fetched' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getScholarships error:', error);
      throw error;
    }
  }

  /**
   * Add scholarship
   */
  async addScholarship(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addScholarship called with payload:', payload);
      const response = await this.post(ENDPOINTS.SCHOLARSHIP_ADD, payload);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to add scholarship';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Scholarship added' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addScholarship error:', error);
      throw error;
    }
  }

  /**
   * Update scholarship
   */
  async updateScholarship(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateScholarship called with id:', id, 'payload:', payload);
      const url = ENDPOINTS.SCHOLARSHIP_UPDATE.replace('{id}', id);
      const response = await this.post(url, { ...payload, _method: 'POST' });
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to update scholarship';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Scholarship updated' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateScholarship error:', error);
      throw error;
    }
  }

  /**
   * Delete scholarship
   */
  async deleteScholarship(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteScholarship called with id:', id);
      const url = ENDPOINTS.SCHOLARSHIP_DELETE.replace('{id}', id);
      const response = await this.get(url);
      
      if (response?.status === false) {
        const errorMsg = response?.msg ? (typeof response.msg === 'string' ? response.msg : Object.values(response.msg).flat().join(', ')) : 'Failed to delete scholarship';
        throw { status: 400, message: errorMsg, data: response };
      }
      
      return { raw: response, data: response?.data, message: 'Scholarship deleted' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteScholarship error:', error);
      throw error;
    }
  }

  /**
   * Get subjects list with optional filters
   */
  async getSubjects(filters = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getSubjects called with filters:', filters);
      const response = await this.post(ENDPOINTS.SUBJECT_GET, filters);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getSubjects error:', error);
      throw error;
    }
  }

  /**
   * Add a new subject
   * @param {Object} payload { name, code, subject_credit_hours, subject_type, grade_id, section_id }
   */
  async addSubject(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addSubject called with payload:', payload);
      const response = await this.post(ENDPOINTS.SUBJECT_ADD, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addSubject error:', error);
      throw error;
    }
  }

  /**
   * Update a subject
   * @param {number} id - Subject ID
   * @param {Object} payload { name, code, subject_credit_hours, subject_type, grade_id, section_id }
   */
  async updateSubject(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSubject called with id:', id, 'payload:', payload);
      const endpoint = ENDPOINTS.SUBJECT_UPDATE.replace('{id}', id);
      const response = await this.post(endpoint, { ...payload, _method: 'POST' });
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateSubject error:', error);
      throw error;
    }
  }

  /**
   * Delete a subject
   * @param {number} id - Subject ID
   */
  async deleteSubject(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteSubject called with id:', id);
      const endpoint = ENDPOINTS.SUBJECT_DELETE.replace('{id}', id);
      const response = await this.get(endpoint);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteSubject error:', error);
      throw error;
    }
  }

  /**
   * Get notices with optional filters
   * @param {Object} filters { grade_id, section_id, for, published_at }
   */
  async getNotices(filters = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getNotices called with filters:', filters);
      const response = await this.post(ENDPOINTS.NOTICE_GET, filters);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getNotices error:', error);
      throw error;
    }
  }

  /**
   * Add a new notice
   * @param {Object} payload { title, desc, published_at, grade_id, section_id, for }
   */
  async addNotice(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addNotice called with payload:', payload);
      const response = await this.post(ENDPOINTS.NOTICE_ADD, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addNotice error:', error);
      throw error;
    }
  }

  /**
   * Update a notice
   * @param {number} id - Notice ID
   * @param {Object} payload { title, desc, published_at, grade_id, section_id, for }
   */
  async updateNotice(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateNotice called with id:', id, 'payload:', payload);
      const endpoint = ENDPOINTS.NOTICE_UPDATE.replace('{id}', id);
      const response = await this.post(endpoint, { ...payload, _method: 'POST' });
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateNotice error:', error);
      throw error;
    }
  }

  /**
   * Delete a notice
   * @param {number} id - Notice ID
   */
  async deleteNotice(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteNotice called with id:', id);
      const endpoint = ENDPOINTS.NOTICE_DELETE.replace('{id}', id);
      const response = await this.get(endpoint);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteNotice error:', error);
      throw error;
    }
  }

  /**
   * Get schedules with optional filters
   * @param {Object} filters { academic_year_id, grade_id, staff_id, start_time, end_time }
   */
  async getSchedules(filters = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getSchedules called with filters:', filters);
      const response = await this.post(ENDPOINTS.SCHEDULE_GET, filters);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getSchedules error:', error);
      throw error;
    }
  }

  /**
   * Add a new schedule
   * @param {Object} payload { grade_id, section_id, staff_id, subject_id, day, start_time, end_time, academic_year_id }
   */
  async addSchedule(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addSchedule called with payload:', payload);
      const response = await this.post(ENDPOINTS.SCHEDULE_ADD, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addSchedule error:', error);
      throw error;
    }
  }

  /**
   * Update a schedule
   * @param {number} id - Schedule ID
   * @param {Object} payload { grade_id, section_id, staff_id, subject_id, day, start_time, end_time, academic_year_id }
   */
  async updateSchedule(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchedule called with id:', id, 'payload:', payload);
      const endpoint = ENDPOINTS.SCHEDULE_UPDATE.replace('{id}', id);
      const response = await this.post(endpoint, { ...payload, _method: 'POST' });
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateSchedule error:', error);
      throw error;
    }
  }

  /**
   * Delete a schedule
   * @param {number} id - Schedule ID
   */
  async deleteSchedule(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteSchedule called with id:', id);
      const endpoint = ENDPOINTS.SCHEDULE_DELETE.replace('{id}', id);
      const response = await this.get(endpoint);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteSchedule error:', error);
      throw error;
    }
  }

  // ============================================================================
  // Student Category Methods
  // ============================================================================

  async getStudentCategories(filters = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getStudentCategories called with filters:', filters);
      const response = await this.get(ENDPOINTS.STUDENT_CATEGORY_GET, filters);
      const data = Array.isArray(response?.data) ? response.data : [];
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getStudentCategories error:', error);
      throw error;
    }
  }

  async addStudentCategory(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addStudentCategory called with payload:', payload);
      const response = await this.post(ENDPOINTS.STUDENT_CATEGORY_ADD, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addStudentCategory error:', error);
      throw error;
    }
  }

  async updateStudentCategory(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateStudentCategory called with id:', id, 'payload:', payload);
      const endpoint = ENDPOINTS.STUDENT_CATEGORY_UPDATE.replace('{id}', id);
      const response = await this.post(endpoint, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateStudentCategory error:', error);
      throw error;
    }
  }

  async deleteStudentCategory(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteStudentCategory called with id:', id);
      const endpoint = ENDPOINTS.STUDENT_CATEGORY_DELETE.replace('{id}', id);
      const response = await this.get(endpoint);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteStudentCategory error:', error);
      throw error;
    }
  }

  // ============================================================================
  // Post Methods
  // ============================================================================

  async getPosts(filters = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getPosts called with filters:', filters);
      const response = await this.get(ENDPOINTS.POST_GET, filters);
      const data = Array.isArray(response?.data) ? response.data : [];
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getPosts error:', error);
      throw error;
    }
  }

  async addPost(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addPost called with payload:', payload);
      const response = await this.post(ENDPOINTS.POST_ADD, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addPost error:', error);
      throw error;
    }
  }

  async updatePost(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updatePost called with id:', id, 'payload:', payload);
      const endpoint = ENDPOINTS.POST_UPDATE.replace('{id}', id);
      const response = await this.post(endpoint, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updatePost error:', error);
      throw error;
    }
  }

  async deletePost(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deletePost called with id:', id);
      const endpoint = ENDPOINTS.POST_DELETE.replace('{id}', id);
      const response = await this.get(endpoint);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deletePost error:', error);
      throw error;
    }
  }

  // ============================================================================
  // Route Pickup Point Methods
  // ============================================================================

  async getRoutePickupPoints(filters = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getRoutePickupPoints called with filters:', filters);
      const response = await this.get(ENDPOINTS.ROUTE_PICKUP_POINT_GET, filters);
      const data = Array.isArray(response?.data) ? response.data : [];
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getRoutePickupPoints error:', error);
      throw error;
    }
  }

  async addRoutePickupPoint(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addRoutePickupPoint called with payload:', payload);
      const response = await this.post(ENDPOINTS.ROUTE_PICKUP_POINT_ADD, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addRoutePickupPoint error:', error);
      throw error;
    }
  }

  async updateRoutePickupPoint(id, payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateRoutePickupPoint called with id:', id, 'payload:', payload);
      const endpoint = ENDPOINTS.ROUTE_PICKUP_POINT_UPDATE.replace('{id}', id);
      const response = await this.post(endpoint, payload);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateRoutePickupPoint error:', error);
      throw error;
    }
  }

  async deleteRoutePickupPoint(id) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] deleteRoutePickupPoint called with id:', id);
      const endpoint = ENDPOINTS.ROUTE_PICKUP_POINT_DELETE.replace('{id}', id);
      const response = await this.get(endpoint);
      const data = response?.data || response || null;
      const message = (typeof response?.message === 'string') ? response.message : null;
      return { data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] deleteRoutePickupPoint error:', error);
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
