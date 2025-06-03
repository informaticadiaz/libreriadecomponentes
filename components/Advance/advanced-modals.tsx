"use client"
import { useState, useRef } from "react"
import {
  X,
  AlertTriangle,
  Info,
  Upload,
  Image as ImageIcon,
  File,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit3,
  Share,
  Copy,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Confirmation Modal
interface ConfirmationModalProps {
  children: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmationModal({
  children,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            {variant === "destructive" ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Info className="h-5 w-5 text-primary" />
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// File Upload Modal
interface FileUploadModalProps {
  children: React.ReactNode
  title: string
  allowedTypes?: string[]
  maxSize?: number
  multiple?: boolean
  onUpload: (files: File[]) => void
}

export function FileUploadModal({
  children,
  title,
  allowedTypes = ["image/*", ".pdf", ".doc", ".docx"],
  maxSize = 10,
  multiple = false,
  onUpload
}: FileUploadModalProps) {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
    setFiles(multiple ? [...files, ...newFiles] : [newFiles[0]])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    setProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
    setTimeout(() => {
      onUpload(files)
      setUploading(false)
      setFiles([])
      setOpen(false)
      setProgress(0)
    }, 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Upload files up to {maxSize}MB. Supported formats: {allowedTypes.join(", ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={allowedTypes.join(",")}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="text-center space-y-2">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  {allowedTypes.join(", ")} up to {maxSize}MB
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                      <div>
                        <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// User Profile Modal
interface UserProfileModalProps {
  children: React.ReactNode
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
    phone?: string
    location?: string
    joinDate: string
    status: "active" | "inactive"
    projects: string[]
    bio?: string
  }
  onEdit?: (user: UserProfileModalProps['user']) => void
  onDelete?: (user: UserProfileModalProps['user']) => void
}

export function UserProfileModal({ children, user, onEdit, onDelete }: UserProfileModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Bio */}
            {user.bio && (
              <div className="space-y-2">
                <Label>About</Label>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Join Date</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>{user.joinDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Active Projects</Label>
                <div className="text-sm">{user.projects.length} projects</div>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <Label>Current Projects</Label>
              <div className="flex flex-wrap gap-2">
                {user.projects.map((project, index) => (
                  <Badge key={index} variant="outline">
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-8 w-8 mb-2" />
                <p>Activity timeline coming soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Account Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Current status: {user.status}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Reset Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Send password reset email to user
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Send Reset
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share className="mr-2 h-3 w-3" />
                Share Profile
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-3 w-3" />
                Copy Link
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <ConfirmationModal
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => {
                  onDelete?.(user)
                  setOpen(false)
                }}
              >
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </Button>
              </ConfirmationModal>
              
              <Button onClick={() => onEdit?.(user)} size="sm">
                <Edit3 className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Example Usage Component
export function ModalExamples() {
  const sampleUser = {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "Lead Developer",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2023",
    status: "active" as const,
    projects: ["Website Redesign", "API Integration", "Mobile App"],
    bio: "Experienced full-stack developer with a passion for creating scalable web applications and mentoring junior developers."
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Modal Examples</h2>
      
      <div className="flex flex-wrap gap-4">
        <ConfirmationModal
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
          confirmText="Delete Project"
          variant="destructive"
          onConfirm={() => console.log("Project deleted")}
        >
          <Button variant="destructive">Delete Project</Button>
        </ConfirmationModal>

        <FileUploadModal
          title="Upload Documents"
          allowedTypes={["image/*", ".pdf", ".doc", ".docx"]}
          maxSize={10}
          multiple={true}
          onUpload={(files) => console.log("Files uploaded:", files)}
        >
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </FileUploadModal>

        <UserProfileModal
          user={sampleUser}
          onEdit={(user) => console.log("Edit user:", user)}
          onDelete={(user) => console.log("Delete user:", user)}
        >
          <Button>
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </UserProfileModal>
      </div>
    </div>
  )
}